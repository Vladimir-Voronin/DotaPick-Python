const mainObjects = {
    heroList: [],
    recommendationList: 0,
    teamAlly: new Team(),
    teamEnemy: new Team()
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

