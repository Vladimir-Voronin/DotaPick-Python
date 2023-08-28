/**
 * @property {Array} heroList General hero list. Used to find new heroes and adding them to teams.
 * @property {RecommendationList} recommendationList hero list of HeroForRecommendationList Objects. Used to work with recommendation list table.
 * @property {Dict} recommendationDictByDotabuffName dictinary [hero.dotabuffName: HeroForRecommendationList]. Very usefull for fast searching by dotabuffName.
 * @property {Team} teamAlly Represents ally team (with heroes inside).
 * @property {Team} teamEnemy Represents enemy team (with heroes inside).
 * @property {Team} currentTeam Represents currently selected team. (This behavior implements by UI).
 * @property {Hero} heroToAdd Current hero which can be added to currently selected team.
 * @property {Set} rolesAnySet Set() which has been formed by roles (from settings) which should be shown in recommendation list if any of roles is matching a specific hero.
 * @property {Set} rolesNecessarySet Set() which has been formed by roles (from settings) which should be shown in recommendation list if all roles is matching roles of a specific hero.
 * @property {boolean} isBlockedUI true if UI us currently blocked.
 * @property {boolean} updateAuto Controls the ability of recommendation list to update when anything affecting it changes. (F. e. Settings or new heroes in teams). 
 * @property {boolean} blockWhenUpdate Controls the behavior of UI when recommendation list is updating.
 */
const mainObjects = {
    heroList: [],
    recommendationList: null,
    recommendationDictByDotabuffName: {},
    teamAlly: new Team(),
    teamEnemy: new Team(),
    currentTeam: null,
    heroToAdd: null,
    rolesAnySet: new Set(),
    rolesNecessarySet: new Set(),
    isBlockedUI: false,
    updateAuto: true,
    blockWhenUpdate: false
}

/**
 * Initializing function. Defines general variables related to main page, calls bindings and UI settings.
 */
function initMainPageObjects() {
    console.log("loading page...");
    blockUI("init main objects.")

    mainPageDefault();

    const promiseCurrentList = getCurrentHeroListFromDB();
    promiseCurrentList
        .then(heroList => {
            setMainObjectsHeroListRelated(heroList);

            changeCurrentTeamObject(mainObjects.teamEnemy);
            updateRecommendationTable();
            fillMainPage();

            keyBindingsInit();
            UIBindings();


            console.log("Page has loaded, mainObjects have been initialized");
            unblockUI();
        });
}

/**
 * Settings some mainObjects properties related to heroList.
 * @param {Array[Hero]} heroList 
 */
function setMainObjectsHeroListRelated(heroList) {
    mainObjects.heroList = heroList;
    mainObjects.recommendationList = new RecommendationList(heroList);
    for (const hero of mainObjects.recommendationList.heroList) {
        mainObjects.recommendationDictByDotabuffName[hero.dotabuffName] = hero;
    }
    console.log(mainObjects.recommendationDictByDotabuffName);
}

/**
 * change currentTeam to selected team. 
 * @param {Team} newTeam 
 */
function changeCurrentTeamObject(newTeam) {
    mainObjects.currentTeam = newTeam;
}


/**
 * Updating visibility of mainObjects.heroList in order to except doublicates in teams. 
 * 
 * This function doesn't change visibility of heroes in recommendationList.
 */
function updateVisibilitiesForDoublicates() {
    for (const hero of mainObjects.heroList) {
        hero.visibility = true;
    }

    for (const hero of mainObjects.heroList) {
        for (const heroInTeam of mainObjects.teamAlly.heroesInTeam) {
            if (hero === heroInTeam) {
                hero.visibility = false;
            }
        }
        for (const heroInTeam of mainObjects.teamEnemy.heroesInTeam) {
            if (hero === heroInTeam) {
                hero.visibility = false;
            }
        }
    }
}