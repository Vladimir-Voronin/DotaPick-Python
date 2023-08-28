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

    constructor(dotabuffName, name, generalWinrate, winrateDict, imagePath, roles, visibility, alliesSet) {
        this.dotabuffName = dotabuffName;
        this.name = name;
        this.generalWinrate = generalWinrate;
        this.winrateDict = winrateDict;
        this.image_path = imagePath;
        this.rolesSet = roles;
        this.visibility = visibility;
        this.alliesSet = alliesSet;
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
        super(hero.dotabuffName, hero.name, hero.generalWinrate, hero.winrateDict, hero.image_path, hero.rolesSet, hero.visibility, hero.alliesSet);
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
    allyCorrectionConst = 1.5;

    constructor(listOfHeroesForRecommendationList) {
        this.heroList = [];

        for (const hero of listOfHeroesForRecommendationList) {
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
        for (const hero of this.heroList) {
            hero.counterWinrate += hero.winrateDict[enemyHero.dotabuffName];
        }
    }

    newAllyRecalculation(allyHero) {
        for (const hero of this.heroList) {
            if (hero.alliesSet.has(allyHero.dotabuffName)) {
                hero.teamCorrectionWinrate += this.allyCorrectionConst;
            }
        }
    }

    /**
     * Resets all additional properties to default.
     */
    #allSubWinratesToZero() {
        for (const hero of this.heroList) {
            hero.counterWinrate = 0;
            hero.teamCorrectionWinrate = 0;
            hero.additionalWinrate = 0;
        }
    }

    /**
     * Recalculate winrates based on heroes from ally team and enemy team.
     */
    fullRecalculation(allyTeam, enemyTeam) {
        this.#allSubWinratesToZero();

        for (const enemy of enemyTeam.heroesInTeam) {
            this.newEnemyRecalculation(enemy);
        }

        for (const ally of allyTeam.heroesInTeam) {
            this.newAllyRecalculation(ally);
        }
    }

    /**
     * Update visibility of heroes based on teams and roles settings. 
     * @param {Team} teamAlly 
     * @param {Team} teamEnemy 
     * @param {Set} rolesIncludeSet if any role of hero is matching role from this param - hero will stay shown.
     * @param {Set} rolesNecessarySet All roles of hero should be in this param in order this hero will be shown.
     */
    updateVisibility(teamAlly, teamEnemy, rolesIncludeSet, rolesNecessarySet) {
        for (const hero of this.heroList) {
            hero.visibility = true;
        }

        for (const hero of this.heroList) {
            for (const ally of teamAlly.heroesInTeam) {
                if (hero.dotabuffName === ally.dotabuffName) {
                    hero.visibility = false;
                }
            }

            for (const enemy of teamEnemy.heroesInTeam) {
                if (hero.dotabuffName === enemy.dotabuffName) {
                    hero.visibility = false;
                }
            }

            if (!isSubSet(rolesNecessarySet, hero.rolesSet)) {
                hero.visibility = false;
            }

            if (!isAnyInSet(rolesIncludeSet, hero.rolesSet)) {
                hero.visibility = false;
            }
        }
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
    heroesInTeam = [];
    #maxHeroesInTeam = 5;

    addHero(hero) {
        if (this.heroesInTeam.length >= this.#maxHeroesInTeam) {
            throw new Error(`Trying add hero to full team (maximum heroes in team: ${this.#maxHeroesInTeam})`);
        }
        this.heroesInTeam.push(hero);
    }

    removeHero(hero) {
        if (!this.heroesInTeam.includes(hero)) {
            throw new Error(`Trying remove non-existent hero.`);
        }

        const indexToDelete = this.heroesInTeam.indexOf(hero);
        this.heroesInTeam.splice(indexToDelete, 1);
    }

    isFull() {
        return this.heroesInTeam.length === this.#maxHeroesInTeam;
    }
}