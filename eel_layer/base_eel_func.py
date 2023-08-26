import eel

from db.read_api import get_complete_hero_list
from parsing.db_update import update_hero_table_general_winrate, update_heroes_winrate_relations, \
    update_full_db_from_scratch
from utils.python_js_converter import convert_hero_list_to_json


@eel.expose
def update_winrates_in_db():
    """ Updating DB table hero: general_winrate and table heroes_winrate. """

    update_hero_table_general_winrate()
    update_heroes_winrate_relations()


@eel.expose
def update_full_db():
    """ Clean DB tables, download data from scratch. """

    update_full_db_from_scratch()


@eel.expose
def return_hero_list_from_db_json():
    """ Return json str of hero_list """

    hero_list = get_complete_hero_list()
    return convert_hero_list_to_json(hero_list)

