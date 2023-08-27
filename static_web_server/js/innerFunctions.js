const mainObjects = {
    heroList: [],
    recommendationList: null,
    teamAlly: new Team(),
    teamEnemy: new Team(),
    currentTeam: null,
    heroToAdd: null,
    rolesAnySet: new Set(),
    rolesNecessarySet: new Set(),
    updateAuto: true,
    blockWhenUpdate: false
}

function initMainPageObjects() {
    console.log("loading page...");
    blockUI("init main objects.")

    mainPageDefault();

    const promiseCurrentList = getCurrentHeroListFromDB();
    promiseCurrentList
        .then(heroList => {
            mainObjects.heroList = heroList;
            mainObjects.recommendationList = new RecommendationList(heroList);
            
            changeCurrentTeamObject(mainObjects.teamEnemy);
            updateRecommendationTable();
            fillMainPage();
            
            keyBindingsInit();
            UIBindings();


            console.log("Page has loaded, mainObjects have been initialized");
            unblockUI();
        });
}

function changeCurrentTeamObject(newTeam) {
    mainObjects.currentTeam = newTeam;
}


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