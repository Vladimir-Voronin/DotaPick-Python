import datetime
import sqlite3
import contextlib
from db.read_api import get_basic_hero_list, get_roles_list
from parsing.parsing_func import create_hero_list_and_make_assignments, add_general_winrate_info_to_hero_list, \
    assign_roles_set_for_hero_list
from utils.general import get_dotapick_db_file


def insert_hero_table_from_scratch():
    """ Get all heroes from dotabuff and insert them into hero table. """

    hero_list = create_hero_list_and_make_assignments()

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

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


def update_role_table():
    """ Go through all heroes in database and update general winrate. """

    hero_list = get_basic_hero_list()
    assign_roles_set_for_hero_list(hero_list)

    all_roles = set(role for hero in hero_list for role in hero.roles_set)

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()
        add_roles_sql = """INSERT INTO role (name) VALUES (?)"""
        for role in all_roles:
            curs.execute(add_roles_sql, (role,))
        conn.commit()


def insert_relations_hero_role_table():
    """ insert relations to hero_role list from scratch.

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


if __name__ == '__main__':
    insert_relations_hero_role_table()
