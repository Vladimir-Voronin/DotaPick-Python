import json
import random
import unittest

from db.read_api import get_complete_hero_list
from tests.config import TEST_PYTHON_JS_CONVERTER_CONST
from utils.python_js_converter import convert_hero_list_to_json


@unittest.skipIf(TEST_PYTHON_JS_CONVERTER_CONST is False, "config settings")
class PythonJsConverterTest(unittest.TestCase):
    def test_convert_hero_list_to_json(self):
        hero_list = get_complete_hero_list()
        json_result = convert_hero_list_to_json(hero_list)

        json_decoding = json.loads(json_result)
        random_json_object = random.choice(json_decoding)
        random_json_object = json.JSONDecoder().decode(random_json_object)
        self.assertIsInstance(random_json_object["id"], int)
        self.assertIsInstance(random_json_object["name"], str)
        self.assertIsInstance(random_json_object["winrate_dict"], dict)
        self.assertIsInstance(random_json_object["roles_set"], list)


if __name__ == '__main__':
    unittest.main()
