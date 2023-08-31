import glob
import unittest
from pathlib import Path

from parsing.parsing_func import get_list_of_hero_only_names
from utils.general import get_root_dir, get_resources_dir


class ResourcesTest(unittest.TestCase):
    def test_roles_files(self):
        path_to_additional_roles_files = get_resources_dir() / Path("additional_roles")

        hero_list = get_list_of_hero_only_names()

        hero_names_set = set((hero.dotabuff_name for hero in hero_list))
        for file in glob.glob(str(path_to_additional_roles_files) + r"\*"):
            with open(file, 'r') as f:
                for line in f:
                    self.assertTrue(True if line.strip() in hero_names_set else False, f"{line.strip()}")

    def test_allies_info(self):
        path_to_allies_info = get_resources_dir() / Path("allies_info/allies_from_dota_wiki")

        hero_list = get_list_of_hero_only_names()

        hero_names_set = set((hero.dotabuff_name for hero in hero_list))

        hero_names_from_file = set()
        with open(path_to_allies_info, 'r') as file:
            for line in file:
                hero, allies = line.split(':')
                allies = tuple(ally.strip() for ally in allies.split(', '))
                hero_names_from_file.add(hero)
                self.assertTrue(all(h in hero_names_set for h in (hero,) + allies))

        self.assertEqual(len(hero_names_from_file), len(hero_names_set))

    def test_default_hero_images(self):
        path_to_default_hero_images = get_resources_dir() / Path("default_hero_images")

        hero_list = get_list_of_hero_only_names()

        hero_names_set = set((hero.dotabuff_name for hero in hero_list))

        hero_files_names_set = set()
        for file in glob.glob(str(path_to_default_hero_images) + "/*.jpg"):
            hero_name = file.split("\\")[-1].replace(".jpg", "").strip()
            self.assertTrue(True if hero_name in hero_names_set else False)
            hero_files_names_set.add(hero_name)

        self.assertEqual(len(hero_names_set), len(hero_files_names_set))


if __name__ == '__main__':
    unittest.main()
