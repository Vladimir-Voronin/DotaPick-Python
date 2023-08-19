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
