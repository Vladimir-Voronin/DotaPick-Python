from pathlib import Path

import sys

IS_CONVERTING_TO_EXE = False


def get_root_dir():
    """ Return root dir of the DotaPick project. """

    return Path(__file__).parent.parent


def get_web_server_resources_dir():
    return get_static_web_server_dir() / Path('image/resources')


def get_dotapick_db_file():
    if IS_CONVERTING_TO_EXE:
        return Path(sys.executable).parent / Path('db/dotapick.db')
    else:
        return get_root_dir() / Path(r'db/dotapick.db')


def get_static_web_server_dir():
    return get_root_dir() / Path(r'static_web_server')


ALLIES_FROM_DOTA_WIKI_FILE_PATH = get_root_dir() / Path(r'resources/allies_info/allies_from_dota_wiki')
