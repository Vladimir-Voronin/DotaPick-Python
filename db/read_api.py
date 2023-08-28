import contextlib
import sqlite3

from model.models import Hero, Role
from utils.general import get_dotapick_db_file


def get_basic_hero_list():
    """ Return List[Hero] with basic info from hero table. """

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()
        curs.execute("""SELECT id, dotabuff_name, name, update_date, general_winrate, image_path FROM hero""")

        result = curs.fetchall()
        hero_list = [Hero(id_=hero_info_tuple[0],
                          dotabuff_name=hero_info_tuple[1],
                          name=hero_info_tuple[2],
                          update_date=hero_info_tuple[3],
                          general_winrate=hero_info_tuple[4],
                          image_path=hero_info_tuple[5]) for hero_info_tuple in result]

    return hero_list


def get_complete_hero_list():
    """ Return hero_list with all necessary attrs included.

        In particular: winrate_dict, roles_set and allies_set included.
    """

    hero_list = get_basic_hero_list()
    hero_d_name_hero_obj_dict = {hero.dotabuff_name: hero for hero in hero_list}

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        pull_roles_out_sql = """SELECT role.name FROM role JOIN hero_role ON role.id = hero_role.role_id
                                JOIN hero ON hero.id = hero_role.hero_id WHERE hero.id = ?"""

        for hero in hero_list:
            curs.execute(pull_roles_out_sql, (hero.id,))
            hero.roles_set = set(role_wrap[0] for role_wrap in curs.fetchall())

        pull_winrate_dict_out_sql = """SELECT h_enemy.dotabuff_name, heroes_winrate.winrate FROM heroes_winrate
                                       JOIN hero h_self ON h_self.id = heroes_winrate.hero_id
                                       JOIN hero h_enemy ON h_enemy.id = heroes_winrate.hero_id_enemy
                                       WHERE h_self.id = ?"""

        for hero in hero_list:
            curs.execute(pull_winrate_dict_out_sql, (hero.id,))
            hero.winrate_dict = {hero_d_name_hero_obj_dict[enemy_winrate_tuple[0]]: enemy_winrate_tuple[1] for
                                 enemy_winrate_tuple in curs.fetchall()}

        get_allies_set_sql = """SELECT hero_table_2.dotabuff_name FROM ally JOIN hero hero_table ON
                                ally.hero_id = hero_table.id JOIN hero hero_table_2 ON ally.ally_id = hero_table_2.id
                                WHERE hero_table.id = ?"""

        for hero in hero_list:
            curs.execute(get_allies_set_sql, (hero.id,))
            hero.allies_set = set((ally[0] for ally in curs.fetchall()))

    return hero_list


def get_roles_list():
    """ Return List[Role] from role table. """

    roles_list = []

    with contextlib.closing(sqlite3.connect(get_dotapick_db_file())) as conn:
        curs = conn.cursor()

        get_roles_sql = """SELECT id, name FROM role"""
        curs.execute(get_roles_sql)

        result = curs.fetchall()

    for role_info in result:
        roles_list.append(Role(id_=role_info[0], name=role_info[1]))

    return roles_list


if __name__ == '__main__':
    hero_list = get_complete_hero_list()
