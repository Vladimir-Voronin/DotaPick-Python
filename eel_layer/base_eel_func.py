import eel

from db.read_api import get_complete_hero_list
from parsing.db_update import update_hero_table_general_winrate, update_heroes_winrate_relations, \
    update_full_db_from_scratch
from recognizer.pick_stage_recognizer import get_heroes_from_screenshot
from utils.python_js_converter import convert_hero_list_to_json
from PIL import ImageGrab, Image


@eel.expose
def update_winrates_in_db():
    """ Updating DB table hero: general_winrate and table heroes_winrate. """

    print("DB winrates update starts...")
    update_hero_table_general_winrate()
    update_heroes_winrate_relations()
    print("DB winrates update ends...")
    return True


@eel.expose
def update_full_db():
    """ Clean DB tables, download data from scratch. """

    print("full db update starts...")
    update_full_db_from_scratch()
    print("full db update ends")
    return True


@eel.expose
def return_hero_list_from_db_json():
    """ Return json str of hero_list """

    hero_list = get_complete_hero_list()
    return convert_hero_list_to_json(hero_list)


@eel.expose
def start_pick_stage_recognition(my_team_is_left):
    """ Return json str of recognised hero in both teams during picked stage.

        Based on screenshot taken from clipboard.
        Json str may return "error" with "error_message" inside.
    """

    img = ImageGrab.grabclipboard()
    return get_heroes_from_screenshot(img, my_team_is_left)
