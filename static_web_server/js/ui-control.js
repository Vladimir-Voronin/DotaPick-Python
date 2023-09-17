/**
 * calls a loading page that blocks UI.
 * 
 * TODO: implement reason display on screen
 * @param {String} reason  Reason of blocking.
 * @param {boolean} display  Show reason on screen or not.
 */
function blockUI(reason, display = false) {
    mainObjects.isBlockedUI = true;
    $("#ui-block-div").show();
}

/**
 * hide loading page - unblock UI.
 */
function unblockUI() {
    mainObjects.isBlockedUI = false;
    $("#ui-block-div").hide();
}

/**
 * Returns general div of "ally team".
 * @returns Ally <div>
 */
function getAllyTeamUI() {
    return $("#ally-team");
}

/**
 * Returns general div of "enemy team". 
 * @returns Enemy <div>
 */
function getEnemyTeamUI() {
    return $("#enemy-team");
}

/**
 *  Switch UI indicator (panel) of choosed team.
 * @param {Team} toTeam  Team to choose 
 */
function changeTeamIndicator(toTeam) {
    if (toTeam === mainObjects.teamAlly) {
        $("#ally-indicator").addClass("indicator_on");
        $("#enemy-indicator").removeClass("indicator_on");
    }
    else {
        $("#enemy-indicator").addClass("indicator_on");
        $("#ally-indicator").removeClass("indicator_on");
    }
}

/**
 * Change currently selected team (In logic and in UI).
 */
function changeTeam() {
    if (mainObjects.currentTeam === mainObjects.teamAlly) {
        changeTeamIndicator(mainObjects.teamEnemy);
        changeCurrentTeamObject(mainObjects.teamEnemy);
    }
    else if (mainObjects.currentTeam === mainObjects.teamEnemy) {
        changeTeamIndicator(mainObjects.teamAlly);
        changeCurrentTeamObject(mainObjects.teamAlly);
    }
}

/**
 * Returns Hero write panel <div>. 
 * @returns <div>
 */
function getNewHeroWritePanel() {
    return $(".write-new-hero");
}

/**
 * Returns hero if only one hero is matching the inner string.
 * @param {String} currentString current state of "hero write panel" 
 * @returns hero or null
 */
function getOnlyOneAvailableHero(currentString) {
    result = [];
    for (const hero of mainObjects.heroList) {
        if (hero.name.toLowerCase().startsWith(currentString)) {
            if (hero.visibility === true) {
                result.push(hero);
            }

            if (result.length > 1) {
                return null;
            }
        }
    }
    if (result.length === 1) {
        return result[0];
    }
}

/**
 * if there is only one hero that matches the write panel string - change UI and return this hero. 
 * @returns hero or null
 */
function checkIfThereIsHeroToAdd() {
    result = $(".write-new-hero").text();
    hero = getOnlyOneAvailableHero($(".write-new-hero").text());
    if (!hero) {
        mainObjects.heroToAdd = null;
        $(".hero-prompt-div").hide();
    }
    else {
        mainObjects.heroToAdd = hero;
        $("#add-hero-img").attr("src", defaultHeroImagesPath + hero.image_path);
        $(".hero-prompt-div").show();

        return hero;
    }
}

/**
 * Adding hero to currently selected team if possible. 
 * @returns null
 */
function addHeroToTeam() {
    hero = checkIfThereIsHeroToAdd();
    if (!hero) {
        return;
    }
    clearWritePanel();
    try {
        mainObjects.currentTeam.addHero(mainObjects.heroToAdd);
    } catch (error) {
        console.log(`Error: ${error}`);

        return;
    } finally {
        checkIfThereIsHeroToAdd();
    }
    showTeamHeroes();
    updateVisibilitiesForDoublicates();
    updateIfUpdateAuto();
}

function addHeroToTeamByObject(hero, team) {
    clearWritePanel();
    try {
        team.addHero(hero);
    } catch (error) {
        console.log(`Error: ${error}`);

        return;
    }
    showTeamHeroes();
    updateVisibilitiesForDoublicates();
    updateIfUpdateAuto();
}

/**
 * Updating table based on settings and choosed heroes in teams.
 * 
 * Can update with UI block and without based on mainObjects.blockWhenUpdate state.
 */
function updateTableHandler() {
    if (mainObjects.blockWhenUpdate) {
        blockUI();

        setTimeout(() => {
            makeRecalculationAndUpdateTable();

            setHoverTableHeroesHandlers();

            unblockUI()
        }, 10);
    }
    else {
        makeRecalculationAndUpdateTable();

        setHoverTableHeroesHandlers();
    }
}

const defaultHeroImageFilePath = "../image/unknown_hero.jpg";

/**
 * Show all heroes in teams in UI based on mainObjects.team{Ally}{Enemy}. 
 */
function showTeamHeroes() {
    function showSpecificTeamHeroes(team, uiElements) {
        for (let k = 0; k < uiElements.length; k++) {
            const element = uiElements.eq(k);
            element.attr("data-value", "");
            element.find(".hero-image-default").attr("src", defaultHeroImageFilePath);
        }

        for (let i = 0; i < team.heroesInTeam.length; i++) {
            const element = team.heroesInTeam[i];
            const s = uiElements.eq(i);
            uiElements.eq(i).attr("data-value", element.dotabuffName);
            uiElements.eq(i).find(".hero-image-default").attr("src", defaultHeroImagesPath + element.image_path);
        }
    }
    allyTeamHeroUIElements = $("#ally-team .hero-in-team");
    enemyTeamHeroUIElements = $("#enemy-team .hero-in-team")
    showSpecificTeamHeroes(mainObjects.teamAlly, allyTeamHeroUIElements);
    showSpecificTeamHeroes(mainObjects.teamEnemy, enemyTeamHeroUIElements);
}

/**
 * Removing hero from team and update table (if auto update is on). 
 * @param {Team} team 
 * @param {String} dotabuffHeroName 
 */
function removeHeroFromTeam(team, dotabuffHeroName) {
    hero = mainObjects.heroList.find((x) => x.dotabuffName === dotabuffHeroName);
    if (hero) {
        team.removeHero(hero);
        showTeamHeroes();
        updateVisibilitiesForDoublicates();
        updateIfUpdateAuto();
    }
}

/*
 * Removing all heroes from teams
 */
function removeAllHeroesFromBothTeams() {
    for (const hero of [...mainObjects.teamAlly.heroesInTeam]) {
        removeHeroFromTeam(mainObjects.teamAlly, hero.dotabuffName);
    }
    for (const hero of [...mainObjects.teamEnemy.heroesInTeam]) {
        removeHeroFromTeam(mainObjects.teamEnemy, hero.dotabuffName);
    }
}

/**
 * Bind 'click' on heroes from teams to remove them from specific team.
 */
function bindHeroesFromTeamRemove() {
    $("#ally-team .hero-in-team").on('click', function (e) {
        removeHeroFromTeam(mainObjects.teamAlly, e.currentTarget.dataset.value);
    });
    $("#enemy-team .hero-in-team").on('click', function (e) {
        removeHeroFromTeam(mainObjects.teamEnemy, e.currentTarget.dataset.value);
    });
}

/**
 * Bind 'Enter' to add hero to currently selected team.
 */
function keyBindingAddHeroToTeam() {
    $(document).keydown(function (e) {
        if (!mainObjects.isBlockedUI) {
            // Enter
            if (e.keyCode === 13) {
                e.preventDefault();
                addHeroToTeam();
            }
        }
    });
}

/**
 * UI clear write panel.
 */
function clearWritePanel() {
    getNewHeroWritePanel().empty();
}

/**
 * Binds keyboard to work with adding new heroes to teams.
 */
function keyBindingsWriteNewHero() {
    $(document).keydown(function (e) {
        if (!mainObjects.isBlockedUI) {
            if (e.ctrlKey) {
                return;
            }
            // From A to Z
            if ((e.keyCode >= 65 && e.keyCode <= 90)) {
                getNewHeroWritePanel().append(String.fromCharCode(`${e.which}`).toLocaleLowerCase());
                checkIfThereIsHeroToAdd();
            }
            // -
            else if (e.keyCode === 189) {
                getNewHeroWritePanel().append('-');
                checkIfThereIsHeroToAdd();
            }
            // '
            else if (e.keyCode === 222) {
                getNewHeroWritePanel().append("'");
                checkIfThereIsHeroToAdd();
            }
            // Space
            else if (e.keyCode === 32) {
                getNewHeroWritePanel().append(" ");
                checkIfThereIsHeroToAdd();
            }
        }
    });

    $(document).keydown(function (e) {
        if (!mainObjects.isBlockedUI) {
            if (e.keyCode === 8) {
                clearWritePanel();
                checkIfThereIsHeroToAdd();
            }
        }
    })
}

/** 
 * Binding 'Tab' to switch between selected teams.
 */
function keyBindingsInit() {
    // Tab
    $(document).keydown(function (e) {
        if (!mainObjects.isBlockedUI) {
            if (e.keyCode === 9) {
                e.preventDefault();
                changeTeam();
            }
        }
    });

    keyBindingsWriteNewHero();
    keyBindingAddHeroToTeam();
}

/**
 * Bind button on updating recommendation table.
 * 
 * Useless if auto update is on. (TODO)
 */
function bindUpdateTableButton() {
    $(".update-table-button").on('click', (e) => {
        updateTableHandler();
        e.target.blur();
    });
}

/**
 * Block UI and updating winrates in DB, then reload page to get actual data.
 */
function updateWinratesInDBStarts() {
    blockUI();

    setTimeout(() => {
        const promise = updateWinratesInDB();

        promise.then(() => {
            location.reload();
            unblockUI();
        })
    }, 10);
}

/**
 * Block UI and updating full DB, then reload page to get actual data.
 */
function updateFullDBStarts() {
    blockUI();

    setTimeout(() => {
        const promise = updateFullDB();

        promise.then(() => {
            location.reload();
            unblockUI();
        })
    }, 10);
}

/**
 * Bind button for updating winrates in DB
 */
function bindUpdateWinratesFromDBButton() {
    $("#update-winrates-button").on('click', updateWinratesInDBStarts);
}

/**
 * Bind button for updating full DB
 */
function bindUpdateFullDBButton() {
    $('#update-full-db-button').on('click', updateFullDBStarts);
}

function closeChooseYourTeamDialog() {
    $('#my-team-left-recognition').off('click');
    $('#my-team-right-recognition').off('click');
    $('#cancel-recognition').off('click');

    $('#ui-block-dialog').empty();
    $('#ui-block-dialog').hide();
}

function startRecognition(myTeamIsLeft) {
    closeChooseYourTeamDialog();
    blockUI();

    setTimeout(() => {
        const promise = startPickStageRecognition(myTeamIsLeft);

        promise.then((jsonInfo) => {
            console.log(jsonInfo);
            const info = JSON.parse(jsonInfo);

            if (info.error.error_state) {
                unblockUI();
                return;
            }
            removeAllHeroesFromBothTeams();

            const uniqueHeroes = new Set();
            for (const heroName of info['ally_team']) {
                const hero = mainObjects.heroDictByDotabuffName[heroName];
                if (uniqueHeroes.has(hero)) {
                    continue;
                }

                addHeroToTeamByObject(hero, mainObjects.teamAlly);
                uniqueHeroes.add(hero);
            }

            for (const heroName of info['enemy_team']) {
                const hero = mainObjects.heroDictByDotabuffName[heroName];
                if (uniqueHeroes.has(hero)) {
                    continue;
                }

                addHeroToTeamByObject(hero, mainObjects.teamEnemy);
                uniqueHeroes.add(hero);
            }
            unblockUI();
        });
    }, 10);
}

/*
 * Showing choose your team dialog for recognizing heroes during pick stage.
 * Also defining some event handlers on buttons inside this dialog.
 */
function showChooseYourTeamDialog() {
    $('#ui-block-dialog').append(
        `<div class="center">
            <div class="dialog-box">
                <div class="dialog-message">Recognition activated. Your team is?</div>
                <div class="dialog-answers-row">
                    <div class="dialog-answer-block">
                        <button id="my-team-left-recognition" class="button-29">
                            Radiant (left)
                        </button>
                    </div>
                    <div class="dialog-answer-block">
                        <button id="my-team-right-recognition" class="button-29">
                            Dire (right)
                        </button>
                    </div>
                    <div class="dialog-answer-block">
                        <button id="cancel-recognition"  class="button-29">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>`,
    );

    // events to button
    $('#my-team-left-recognition').on('click', () => {
        startRecognition(true);
    });
    $('#my-team-right-recognition').on('click', () => {
        startRecognition(false);
    });
    $('#cancel-recognition').on('click', () => {
        closeChooseYourTeamDialog();
    });
    $('#ui-block-dialog').show();
}
/*
 * Getiting screenshot from clipboard and push it to recognize func
 */
function bindRecognizeFromClipboardOnPaste() {
    document.onpaste = (evt) => {
        const dT = evt.clipboardData || window.clipboardData;
        const file = dT.files[0];
        if (!file) {
            return;
        }
        if (!file.type === 'image/png') {
            return;
        }
        if (mainObjects.isBlockedUI) {
            return;
        }

        // close current dialog if user paste screenshot while dialog is opened
        closeChooseYourTeamDialog();

        console.log(file);
        showChooseYourTeamDialog();
    };
}

/**
 * UI bindings.
 */
function UIBindings() {
    bindHeroesFromTeamRemove();
    bindUpdateTableButton();
    bindUpdateWinratesFromDBButton();
    bindUpdateFullDBButton();
    bindRecognizeFromClipboardOnPaste();
}

/**
 * Adding setting to mainObjects.rolesAnySet if checkbox is checked. 
 * @param {DOM} roleUI setting checkbox
 */
function checkboxRolesAny(roleUI) {
    if ($(roleUI).is(':checked')) {
        mainObjects.rolesAnySet.add(roleUI.getAttribute("data-value"));
    }
    else {
        mainObjects.rolesAnySet.delete(roleUI.getAttribute("data-value"));
    }
    updateIfUpdateAuto();
}

/**
 * Adding setting to mainObjects.rolesNecessarySet if checkbox is checked. 
 * @param {DOM} roleUI setting checkbox
 */
function checkboxRolesNecessary(roleUI) {
    if ($(roleUI).is(':checked')) {
        mainObjects.rolesNecessarySet.add(roleUI.getAttribute("data-value"));
    }
    else {
        mainObjects.rolesNecessarySet.delete(roleUI.getAttribute("data-value"));
    }
    updateIfUpdateAuto();
}

/**
 * Update recommendation table function (works only if auto update is on).
 */
function updateIfUpdateAuto() {
    if (mainObjects.updateAuto === true) {
        updateTableHandler();
    }
}

/**
 * Fill settings section with checkbox corresponding to unique roles in heroList.
 */
function fillSettingsWithRoles() {
    allRoles = new Set();

    for (const hero of mainObjects.heroList) {
        for (const role of hero.rolesSet) {
            allRoles.add(role);
        }
    }

    rolesAny = [];
    rolesNecessary = [];

    for (const role of allRoles) {
        if (role.includes('pos')) {
            rolesAny.push(role);
        }
        else {
            rolesNecessary.push(role);
        }
    }

    rolesAny.sort((a, b) => {
        if (a[a.length - 2] < b[b.length - 2]) {
            return -1;
        }
        return 1;

    })

    // Removing "Carry" and "Support" roles
    let indexToDelete = rolesNecessary.indexOf("Carry");
    rolesNecessary.splice(indexToDelete, 1);
    indexToDelete = rolesNecessary.indexOf("Support");
    rolesNecessary.splice(indexToDelete, 1);

    for (const role of rolesAny) {
        const appendStr = `<div class="checkbox-block">
                        <div class="checkbox-wrapper-2">
                            <input type="checkbox" class="sc-gJwTLC ikxBAC" data-value="${role}">
                            <label class="checkbox-label">${role}</label>
                        </div>
                    </div>`
        $("#roles-any").append(appendStr);

        $(".checkbox-wrapper-2").find(`[data-value='${role}']`)
            .change(function () {
                checkboxRolesAny(this);
            });

        $(".checkbox-wrapper-2").find(`[data-value='${role}']`).prop('checked', true).trigger("change");
    }

    for (const role of rolesNecessary) {
        const appendStr = `<div class="checkbox-block">
                        <div class="checkbox-wrapper-2">
                            <input type="checkbox" class="sc-gJwTLC ikxBAC" data-value="${role}">
                            <label class="checkbox-label">${role}</label>
                        </div>
                    </div>`


        $("#roles-necessary").append(appendStr);

        $('.checkbox-wrapper-2').find(`[data-value='${role}']`)
            .change(function () {
                checkboxRolesNecessary(this);
            });
    }
}

/**
 * Implements behavior of UI when user hovers over hero in table.
 * 
 * Supports matchup against enemy team's heroes and pleasant allies.  
 * @param {JqueryObj} heroInTableUI 
 */
function hoverHeroInTableIN(heroInTableUI) {
    const currentHeroDotabuffName = $(heroInTableUI.currentTarget).find("img").attr("data-value");
    const currentHero = mainObjects.recommendationDictByDotabuffName[currentHeroDotabuffName];

    $("#enemy-team .team-heroes .hero-in-team").each((index) => {
        const enemy = $("#enemy-team .team-heroes .hero-in-team").eq(index);
        const enemyDotabuffName = enemy.attr("data-value");
        if (enemyDotabuffName) {
            const winrateOverEnemy = currentHero.winrateDict[enemyDotabuffName];
            const currentMatchupPanel = $(enemy).find(".matchup-hero-info");

            if (winrateOverEnemy >= 0) {
                currentMatchupPanel.append(winrateOverEnemy.toFixed(2) + "%");
                currentMatchupPanel.addClass("positive-number");
            }
            else {
                currentMatchupPanel.append(winrateOverEnemy.toFixed(2) + "%");
                currentMatchupPanel.addClass("negative-number");
            }
        }
    })

    $("#ally-team .team-heroes .hero-in-team").each((index) => {
        const ally = $("#ally-team .team-heroes .hero-in-team").eq(index);
        const allyDotabuffName = ally.attr("data-value");
        if (allyDotabuffName) {
            if (currentHero.alliesSet.has(allyDotabuffName)) {
                const currentAllyImage = $(ally).find("img");

                currentAllyImage.addClass("image-shining");
            }
        }
    });
}

/**
 * Removes UI effects when user hover out from hero in recommendation table. 
 * @param {JqueryObj} heroInTableUI 
 */
function hoverHeroInTableOut(heroInTableUI) {
    $("#enemy-team .team-heroes .hero-in-team").each((index) => {
        const enemy = $("#enemy-team .team-heroes .hero-in-team").eq(index);
        const currentMatchupPanel = $(enemy).find(".matchup-hero-info");
        currentMatchupPanel.empty();
        currentMatchupPanel.removeClass("positive-number");
        currentMatchupPanel.removeClass("negative-number");
    });

    $("#ally-team .team-heroes .hero-in-team").each((index) => {
        const ally = $("#ally-team .team-heroes .hero-in-team").eq(index);

        const currentAllyImage = $(ally).find("img");
        currentAllyImage.removeClass("image-shining");
    });
}

/**
 * Implements behavior of table ui when user hovering over specific hero.
 * 
 * Should be called when table's rows refreshed.
 */
function setHoverTableHeroesHandlers() {
    $(".odd").hover(hoverHeroInTableIN, hoverHeroInTableOut);
    $(".even").hover(hoverHeroInTableIN, hoverHeroInTableOut);
}

/**
 * Fill main page with some data.
 */
function fillMainPage() {
    fillSettingsWithRoles();
}

/** 
 * Default actions on page before bringing control to user. 
 */
function mainPageDefault() {
    clearWritePanel();
    checkIfThereIsHeroToAdd();
}
