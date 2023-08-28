import datetime
import sqlite3
import contextlib
from db.read_api import get_basic_hero_list, get_roles_list
from parsing.parsing_func import create_hero_list_and_make_assignments, add_general_winrate_info_to_hero_list, \
    assign_roles_set_for_hero_list, assign_winrate_dict_to_hero_list, get_list_of_hero_only_names, \
    download_default_images_for_hero_list
from utils.general import get_dotapick_db_file, ALLIES_FROM_DOTA_WIKI_FILE_PATH


def add_hero_table_from_scratch():
    """ Get all heroes from dotabuff and insert them into hero table. """

    hero_list = create_hero_list_and_make_assignments()

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        clean_table_sql = """DELETE FROM hero"""
        curs.execute(clean_table_sql)
        conn.commit()

        for hero in hero_list:
            curs.execute(
                f"""INSERT INTO hero(dotabuff_name, name, update_date, general_winrate, image_path) 
                    VALUES(?, ?, ?, ?, ?)""",
                (hero.dotabuff_name, hero.name, str(datetime.datetime.now()), hero.general_winrate,
                 str(hero.image_path)))

        conn.commit()


def update_hero_table_general_winrate():
    """ Go through all heroes in database and update general winrate. """

    hero_list = get_basic_hero_list()
    add_general_winrate_info_to_hero_list(hero_list)

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        update_general_winrate_sql = """UPDATE hero SET general_winrate = ?, update_date = ?
                                        WHERE id = ?"""
        for hero in hero_list:
            curs.execute(update_general_winrate_sql, (hero.general_winrate, str(datetime.datetime.now()), hero.id))

        conn.commit()


def add_roles_in_role_table_from_scratch():
    """ Go through all heroes in database and add new roles to role table. """

    hero_list = get_basic_hero_list()
    assign_roles_set_for_hero_list(hero_list)

    all_roles = set(role for hero in hero_list for role in hero.roles_set)

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        clean_table_sql = """DELETE FROM role"""
        curs.execute(clean_table_sql)
        conn.commit()

        add_roles_sql = """INSERT INTO role (name) VALUES (?)"""
        for role in all_roles:
            curs.execute(add_roles_sql, (role,))
        conn.commit()


def add_relations_hero_role_table_from_scratch():
    """ insert relations to hero_role table from scratch.

    Before processing hero_role table will be cleaned."""

    hero_list = get_basic_hero_list()
    assign_roles_set_for_hero_list(hero_list)
    roles_list = get_roles_list()

    roles_dict = {role.name: role.id for role in roles_list}

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        # clean data from hero_role table
        clean_table_sql = """DELETE FROM hero_role"""
        curs.execute(clean_table_sql)
        conn.commit()

        # Adding information
        add_relation_sql = """INSERT INTO hero_role (hero_id, role_id) VALUES (?, ?)"""
        for hero in hero_list:
            for role in hero.roles_set:
                curs.execute(add_relation_sql, (hero.id, roles_dict[role]))
        conn.commit()


def add_heroes_winrate_relations_from_scratch():
    """ Adding info to heroes_winrate table.

        Table will be cleaned before processing.
    """
    hero_list = get_basic_hero_list()
    assign_winrate_dict_to_hero_list(hero_list)

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        clean_table_sql = """DELETE FROM heroes_winrate"""
        curs.execute(clean_table_sql)
        conn.commit()

        insert_heroes_winrate_sql = """INSERT INTO heroes_winrate (hero_id, hero_id_enemy, winrate, update_date)
                                       VALUES (?, ?, ?, ?)"""
        for hero in hero_list:
            for enemy, winrate in hero.winrate_dict.items():
                curs.execute(insert_heroes_winrate_sql, (hero.id, enemy.id, winrate, str(datetime.datetime.now())))
        conn.commit()


def update_heroes_winrate_relations():
    """ Update table heroes_winrate with actual info from dotabuff. """

    hero_list = get_basic_hero_list()
    assign_winrate_dict_to_hero_list(hero_list)

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        update_heroes_winrate_sql = """UPDATE heroes_winrate SET winrate = ?, update_date = ? 
                                        WHERE hero_id = ? AND hero_id_enemy = ?"""
        for hero in hero_list:
            for enemy, winrate in hero.winrate_dict.items():
                curs.execute(update_heroes_winrate_sql, (winrate, str(datetime.datetime.now()), hero.id, enemy.id))
        conn.commit()


def insert_into_ally_table():
    """ Updating table ally with best allies for every hero. """

    hero_list = get_basic_hero_list()

    hero_dict = {hero.dotabuff_name: hero.id for hero in hero_list}
    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        clean_table_sql = """DELETE FROM ally"""
        curs.execute(clean_table_sql)
        conn.commit()

        insert_ally_sql = """INSERT INTO ally (hero_id, ally_id) VALUES (?, ?)"""

        with open(ALLIES_FROM_DOTA_WIKI_FILE_PATH, 'r') as file:
            for line in file:
                hero_ally = line.split(":")
                hero_ally = [str_.strip() for str_ in hero_ally]
                hero = hero_ally[0]
                allies = hero_ally[1].split(", ")
                for ally in allies:
                    curs.execute(insert_ally_sql, (hero_dict[hero], hero_dict[ally]))
        conn.commit()


def update_full_db_from_scratch():
    """ Clean all data in DB and download data from scratch. """

    hero_list = get_list_of_hero_only_names()
    download_default_images_for_hero_list(hero_list)

    add_hero_table_from_scratch()
    add_roles_in_role_table_from_scratch()
    add_relations_hero_role_table_from_scratch()
    add_heroes_winrate_relations_from_scratch()
    insert_into_ally_table()


if __name__ == '__main__':
    # insert_into_ally_table()
    pass
