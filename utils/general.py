from pathlib import Path


def get_root_dir():
    """ Return root dir of the DotaPick project. """

    return Path(__file__).parent.parent


def get_resources_dir():
    return get_static_web_server_dir() / Path('image/resources')


def get_dotapick_db_file():
    return get_root_dir() / Path(r'db/dotapick.db')


def get_static_web_server_dir():
    return get_root_dir() / Path(r'static_web_server')
