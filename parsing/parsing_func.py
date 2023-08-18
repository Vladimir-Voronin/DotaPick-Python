import requests
from pathlib import Path
import shutil
import wget
from bs4 import BeautifulSoup

from model.models import Hero
from utils.general import get_root_dir, get_resources_dir

DOTABUFF_LINK_PREFIX = r"https://dotabuff.com/"
DOTABUFF_ALL_HEROES_LINK = r"https://dotabuff.com/heroes/"
DOTABUFF_ALL_HEROES_WINRATE_LINK = "https://dotabuff.com/heroes/winning/"
DOTABUFF_COUNTERS_LINK_SUFFIX = r"/counters"
HEADERS = {'User-Agent': 'Mozilla/5.0'}
IMAGE_DIR = get_resources_dir() / Path('default_hero_images')


def get_dotabuff_soup(link):
    """ return a BeautifulSoup object for any dotabuff link. """

    r = requests.get(link, headers=HEADERS)
    soup = BeautifulSoup(r.text, 'html.parser')
    return soup


def get_list_of_hero_only_names():
    """ Create list of Hero objects but only name and dotabuff_name included. """

    hero_list = []

    soup = get_dotabuff_soup(DOTABUFF_ALL_HEROES_LINK)

    for h in soup.find_all(class_='hero'):
        new_hero = Hero()

        new_hero.name = h.find('div').text
        new_hero.dotabuff_name = h.parent['href'].split(r'/')[-1]

        hero_list.append(new_hero)

    return hero_list


def add_general_winrate_info_to_hero_list(hero_list):
    """ add general_winrate attribute to hero_list in-place. """

    soup = get_dotabuff_soup(DOTABUFF_ALL_HEROES_WINRATE_LINK)

    for hero in hero_list:
        cell = soup.find("td", attrs={'class': 'cell-icon', 'data-value': f"{hero.name}"})
        hero.general_winrate = float(cell.parent.find_all('td')[2]['data-value'])


def download_default_images_for_hero_list(hero_list):
    """ adding default images into root_dir/resoursec/default_hero_images dir. """

    soup = get_dotabuff_soup(DOTABUFF_ALL_HEROES_WINRATE_LINK)

    for hero in hero_list:
        cell = soup.find("td", attrs={'class': 'cell-icon', 'data-value': f"{hero.name}"})
        image_soup = cell.find('img', class_='image-hero')['src']
        r_image = requests.get(DOTABUFF_LINK_PREFIX + image_soup, stream=True, headers=HEADERS)

        with open(IMAGE_DIR / f"{hero.dotabuff_name}.jpg", 'wb') as f:
            shutil.copyfileobj(r_image.raw, f)


def assign_image_path_for_hero_list(hero_list):
    """ Add pathes to default images for each hero. """

    for hero in hero_list:
        hero.image_path = IMAGE_DIR / (hero.dotabuff_name + ".jpg")


def assign_roles_set_for_hero_list(hero_list):
    """ Add roles to each hero from dotabuff. """

    for hero in hero_list:
        soup = get_dotabuff_soup(DOTABUFF_ALL_HEROES_LINK + hero.dotabuff_name)
        hero.roles_set = set(soup.find('h1').find('small').text.split(', '))


def create_hero_list_and_make_assignments():
    """ Create hero_list from scratch and assign all info except winrate_dict and image. """

    hero_list = get_list_of_hero_only_names()
    add_general_winrate_info_to_hero_list(hero_list)
    assign_image_path_for_hero_list(hero_list)
    assign_roles_set_for_hero_list(hero_list)

    return hero_list


if __name__ == '__main__':
    hero_list = get_list_of_hero_only_names()
    download_default_images_for_hero_list(hero_list)
