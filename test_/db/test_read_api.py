import datetime
import random
import unittest

from db.read_api import get_basic_hero_list, get_roles_list
from test_.config import TEST_READ_API_CONST


@unittest.skipIf(TEST_READ_API_CONST is False, "config settings")
class ReadApiTest(unittest.TestCase):
    def test_get_basic_hero_list(self):
        hero_list = get_basic_hero_list()
        hero = random.choice(hero_list)

        self.assertTrue(isinstance(hero.id, int))
        self.assertTrue(isinstance(hero.dotabuff_name, str))
        self.assertTrue(isinstance(hero.name, str))
        self.assertTrue(isinstance(datetime.datetime.fromisoformat(hero.update_date), datetime.datetime))
        self.assertTrue(isinstance(hero.general_winrate, float))
        self.assertTrue(isinstance(hero.image_path, str))

    def test_get_roles_list(self):
        role_list = get_roles_list()
        role = random.choice(role_list)

        self.assertTrue(isinstance(role.id, int))
        self.assertTrue(isinstance(role.name, str))


if __name__ == '__main__':
    unittest.main()
