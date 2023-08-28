import json

from db.read_api import get_complete_hero_list


def convert_hero_list_to_json(hero_list):
    """ Return json format string for hero_list with transformed hero.winrate_dict."""

    result = []

    for hero in hero_list:
        transform_winrate_dict_to_concise_form(hero)

        hero.roles_set = tuple(role for role in hero.roles_set)
        hero.allies_set = tuple(ally for ally in hero.allies_set)
        hero_json = json.dumps(hero.__dict__)
        result.append(hero_json)

    return json.dumps(result)


def transform_winrate_dict_to_concise_form(hero):
    """ Get hero.winrate_dict and transform it to {dotabuff_name: winrate} form.

        It helps to convert hero to json without extra information
    """

    hero.winrate_dict = {k.dotabuff_name: v for k, v in hero.winrate_dict.items()}
    return hero


if __name__ == '__main__':
    hero_list = get_complete_hero_list()
    res = convert_hero_list_to_json(hero_list)
