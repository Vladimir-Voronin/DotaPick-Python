import json
import re
from pathlib import Path

import PIL
from fastbook import load_learner

from db.read_api import get_basic_hero_list
from model.models import ScreenPickStageParametrs

from fastbook import load_learner

from utils.general import get_resources_dir


class PickStageInfo:
    """ Contains information about pick stage recognizing process. """

    def __init__(self):
        self.error = False
        self.error_message = None
        self.ally_team_names = []
        self.enemy_team_names = []


class PickStageModel:
    """ Singleton class with pick stage Recognizing models inside.

        hero_model - model to recognize heroes
        picked_model - model to recognize is hero picked or not
    """

    __instance = None

    def __init__(self):
        if not PickStageModel.__instance:
            self.hero_model = load_learner(get_resources_dir() / Path('ai_model/HeroTopRecognitionModel.pkl'))
            self.picked_model = load_learner(get_resources_dir() / Path('ai_model/PickedModel.pkl'))

    @classmethod
    def getInstance(cls):
        if not cls.__instance:
            cls.__instance = PickStageModel()
        return cls.__instance

    def recognise(self, image):
        """ take image of hero cell and return name of a hero or anything else (like unknown_hero)"""
        image = image.resize((192, 192))
        picked_var, _, probs = self.picked_model.predict(image)
        if picked_var != 'picked':
            return 'unknown_hero'

        hero_name, _, probs = self.hero_model.predict(image)
        return hero_name


# Supported screenshot resolutions with specific class which has some parametrs how to get heroes' cells
SUPPORTED_SCREENSHOT_RESOULUTIONS = {
    (1920, 1080): ScreenPickStageParametrs(height=32, width=104, left_team_points=(
        (214, 6),
        (338, 6),
        (462, 6),
        (586, 6),
        (710, 6),
    ), right_team_points=(
        (1106, 6),
        (1230, 6),
        (1354, 6),
        (1478, 6),
        (1602, 6),
    )),
    (2560, 1080): ScreenPickStageParametrs(height=32, width=104, left_team_points=(
        (534, 6),
        (658, 6),
        (782, 6),
        (906, 6),
        (1030, 6),
    ), right_team_points=(
        (1426, 6),
        (1550, 6),
        (1674, 6),
        (1798, 6),
        (1922, 6),
    )),
}


def validate_screenshot(screenshot, raw_result):
    """ Check if _size of a screenshot satisfies existed resolution in SUPPORTED_SCREENSHOT_RESOULUTIONS """
    if not screenshot:
        raw_result.error = True
        raw_result.error_message = "Seems like your clipboard doesn't have image inside :("
        return

    if screenshot._size not in SUPPORTED_SCREENSHOT_RESOULUTIONS:
        raw_result.error = True
        raw_result.error_message = f'''resolution of your screenshot is ({screenshot._size}) and it is not supported. \
        Supported resolutions: [{(key for key in SUPPORTED_SCREENSHOT_RESOULUTIONS.keys())}] '''


def create_json_from_picked_stage_heroes(raw_result):
    """ Create Json string based on PickStageInfo instance """
    json_obj = {}
    json_obj["error"] = {}
    json_obj["error"]["error_state"] = raw_result.error
    json_obj["error"]["error_message"] = raw_result.error_message

    json_obj["ally_team"] = raw_result.ally_team_names
    json_obj["enemy_team"] = raw_result.enemy_team_names

    return json.dumps(json_obj)


def update_team(screenshot, update_by_left_pointers, updated_list):
    """ Going through specific team on screenshot and recognize heroes.

        Heroes will be added to updated_list.
    """
    model = PickStageModel()
    current_screen_parametrs = SUPPORTED_SCREENSHOT_RESOULUTIONS[screenshot._size]
    current_pointers = current_screen_parametrs.left_team_points if update_by_left_pointers else current_screen_parametrs.right_team_points
    result = []

    for pare in current_pointers:
        croped_img = screenshot.crop(
            (pare[0], pare[1], pare[0] + current_screen_parametrs.width, pare[1] + current_screen_parametrs.height))
        updated_list.append(model.recognise(croped_img))


def get_heroes_from_screenshot(screenshot, ally_team_left):
    """ Taking screenshot of a pick stage and trying to recognize heroes.

        Returning Json with full information about result.
    """
    raw_result = PickStageInfo()

    validate_screenshot(screenshot, raw_result)
    if raw_result.error:
        return create_json_from_picked_stage_heroes(raw_result)

    update_team(screenshot, True, raw_result.ally_team_names if ally_team_left else raw_result.enemy_team_names)
    update_team(screenshot, False, raw_result.ally_team_names if not ally_team_left else raw_result.enemy_team_names)

    all_names_dict = {re.sub("[^a-z]", "", hero.dotabuff_name.lower()): hero.dotabuff_name for hero in
                      get_basic_hero_list()}

    raw_result.ally_team_names[:] = [all_names_dict[re.sub("[^a-z]", "", name.lower())] for name in
                                     raw_result.ally_team_names if
                                     re.sub("[^a-z]", "", name.lower()) in all_names_dict]
    raw_result.enemy_team_names[:] = [all_names_dict[re.sub("[^a-z]", "", name.lower())] for name in
                                      raw_result.enemy_team_names if
                                      re.sub("[^a-z]", "", name.lower()) in all_names_dict]

    return create_json_from_picked_stage_heroes(raw_result)
