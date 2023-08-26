const mainObjects = {
    heroList: [],
    recommendationList: null,
    teamAlly: new Team(),
    teamEnemy: new Team(),
    currentTeam: null,
    currentTeamUI: null,
    heroToAdd: null,
    rolesAnySet: new Set(),
    rolesNecessarySet: new Set(),
    updateAuto: true,
    blockWhenUpdate: false
}

function initMainPageObjects() {
    console.log("loading page...");
    blockUI("init main objects.")
    const promiseCurrentList = getCurrentHeroListFromDB();
    promiseCurrentList
        .then(heroList => {
            mainObjects.heroList = heroList;
            mainObjects.recommendationList = new RecommendationList(heroList);
            console.log("Page has loaded, mainObjects have been initialized");
            console.log(mainObjects.recommendationList);
            unblockUI();
        });
}

