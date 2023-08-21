import os
import random
import re
import unittest

from parsing.parsing_func import get_list_of_hero_only_names, add_general_winrate_info_to_hero_list, \
    assign_image_path_for_hero_list, assign_roles_set_for_hero_list
from tests.config import TEST_PARSING_FUNC_CONST


@unittest.skipIf(TEST_PARSING_FUNC_CONST is False, "config settings")
class ParsingFuncPreTest(unittest.TestCase):
    def test_get_list_of_hero_only_names(self):
        hero_list = get_list_of_hero_only_names()
        for hero in hero_list:
            self.assertIsNot(hero.name, None)
            self.assertIsNot(hero.dotabuff_name, None)
            self.assertEqual(re.sub(r"[\'\-\s]", "", hero.name).lower(),
                             re.sub(r"[\'\-\s]", "", hero.dotabuff_name).lower())


@unittest.skipIf(TEST_PARSING_FUNC_CONST is False, "config settings")
class ParsingFuncTest(unittest.TestCase):
    def setUp(self) -> None:
        self.hero_list = get_list_of_hero_only_names()

    def test_add_general_winrate_info_to_hero_list(self):
        add_general_winrate_info_to_hero_list(self.hero_list)

        self.assertTrue(all(isinstance(hero.general_winrate, float) for hero in self.hero_list))

        self.assertTrue(all(0 < hero.general_winrate < 100 for hero in self.hero_list))

    def test_assign_image_path_for_hero_list(self):
        assign_image_path_for_hero_list(self.hero_list)

        random_hero = random.choice(self.hero_list)
        self.assertEqual(True, os.path.isfile(random_hero.image_path))

    def test_assign_roles_set_for_hero_list(self):
        assign_roles_set_for_hero_list(self.hero_list[0:1])
        self.assertIsNotNone(self.hero_list[0].roles_set)
        self.assertTrue(len(self.hero_list[0].roles_set) > 0)


if __name__ == '__main__':
    unittest.main()
