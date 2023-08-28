
/**
 * Getting hero list from db and return actual Array[Hero].
 */
async function getCurrentHeroListFromDB() {
    const heroListJsonRequest = await eel.return_hero_list_from_db_json();

    const promiseWithHeroList = heroListJsonRequest()
        .then((heroes) => {
            heroes = JSON.parse(heroes);

            heroList = [];
            for (let heroJson of heroes) {
                heroJson = JSON.parse(heroJson);
                hero = new Hero(heroJson.dotabuff_name, heroJson.name, heroJson.general_winrate,
                    heroJson.winrate_dict, heroJson.image_path, new Set(heroJson.roles_set), true, alliesSet = new Set(heroJson.allies_set));
                heroList.push(hero);
            }
            return heroList;
        })

    return promiseWithHeroList;
}

/**
 *  Updating DB from scratch.
 */
async function updateFullDB() {
    const update = await eel.update_full_db();
    return update;
}

/**
 * Updating winrates in DB.
 */
async function updateWinratesInDB() {
    const update = await eel.updateWinratesInDB();
    return update;
}