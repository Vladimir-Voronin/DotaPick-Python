/**
 * Describes hero with general information from db. 
 */
class Hero {
    dotabuffName;
    name;
    generalWinrate;
    winrateDict;
    image_path;
    rolesSet;
    visibility;

    constructor(dotabuffName, name, generalWinrate, winrateDict, imagePath, roles, visibility) {
        this.dotabuffName = dotabuffName;
        this.name = name;
        this.generalWinrate = generalWinrate;
        this.winrateDict = winrateDict;
        this.image_path = imagePath;
        this.rolesSet = roles;
        this.visibility = visibility;
    }
}

/**
 * Contains additional hero properties to form recommendation list. 
 */
class HeroForRecommendationList extends Hero {
    counterWinrate;
    teamCorrectionWinrate;
    additionalWinrate;

    constructor(hero) {
        super(hero.dotabuffName, hero.name, hero.generalWinrate, hero.winrateDict, hero.imagePath, hero.rolesSet, hero.visibility);
        this.counterWinrate = 0;
        this.teamCorrectionWinrate = 0;
        this.additionalWinrate = 0;
    }

    getFullWinrateSum() {
        return this.generalWinrate + this.counterWinrate + this.teamCorrectionWinrate + this.additionalWinrate;
    }
}

/**
 * support sort function for heroes from recommendation list.
 *  
 * @param {HeroForRecommendationList} a 
 * @param {HeroForRecommendationList} b 
 */
function compareHeroesByWinrates(a, b) {
    const a_value = a.getFullWinrateSum();
    const b_value = b.getFullWinrateSum();
    if (a_value < b_value) {
        return -1;
    }
    else if (a_value > b_value) {
        return 1;
    }
    return 0;
}

/**
 * Implements behavior to manupulate over recommendation hero list. 
 */
class RecommendationList {
    heroList;

    constructor(listOfHeroesForRecommendationList) {
        this.heroList = [];

        for (const hero of listOfHeroesForRecommendationList){
            const newHeroForRecomList = new HeroForRecommendationList(hero);
            this.heroList.push(newHeroForRecomList);
        }
    }

    /**
     * sort heroList by potential winrates (sum of all winrates).
     */
    sortHeroList() {
        this.heroList.sort(compareHeroesByWinrates);
    }

    /**
     * Changing winrates inside recommendation hero list based on new enemy.
     *  
     * @param {Hero} enemyHero 
     */
    newEnemyRecalculation(enemyHero) {

    }

    /**
     * Changing winrates inside recommendation hero list based on new ally.
     *  
     * @param {Hero} enemyHero 
     */
    newAllyRecalculation(allyHero) {

    }

    /**
    * Changing winrates inside recommendation hero list based on removed enemy.
    *  
    * @param {Hero} enemyHero 
    */
    removeEnemyRecalculation(enemyHero) {

    }

    /**
    * Changing winrates inside recommendation hero list based on removed ally.
    *  
    * @param {Hero} enemyHero 
    */
    removeAllyRecalculation(allyHero) {

    }

    /**
     * Changing winrates inside recommendation hero list based on a new ally Team.
     * 
     * @param {Team} allyTeam 
     */
    newAllyTeamRecalculation(allyTeam) {

    }

    /**
     * Changing winrates inside recommendation hero list based on a new enemy Team.
     * 
     * @param {Team} allyTeam 
     */
    newEnemyTeamRecalculation(enemyTeam) {

    }

    /**
     * Update visibility based on neccessary roles.
     * 
     * Only heroes which have all roles in set will stay visible.
     * If empty set pushed to this method, all heroes will be visible.
     *  
     * @param {String} roleName 
     * @param {boolean} isOn 
     */
    updateVisibilityByRolesSet(rolesSet) {
        for (const hero in heroList) {
            if (isSubSet(hero.rolesSet, rolesSet)) {
                hero.visibility = true;
            }
        }
    }
}

/**
 * Contains heroes in team and limitations;
 * 
 * @property {Array} heroesInTeam
 */
class Team {
    heroesInTeam;
    #maxHeroesInTeam = 5;

    addHero(hero) {
        if (this.heroesInTeam.length >= this.#maxHeroesInTeam) {
            throw new Error(`Trying add hero to full team (maximum heroes in team: ${this.#maxHeroesInTeam})`);
        }
        this.heroesInTeam.addHero(hero);
    }

    removeHero(hero) {
        if (!this.heroesInTeam.includes(hero)) {
            throw new Error(`Trying remove non-existent hero.`);
        }

        this.heroesInTeam.remove(hero);
    }

    isFull() {
        return this.heroesInTeam.length === this.#maxHeroesInTeam;
    }
}