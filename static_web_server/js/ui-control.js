function blockUI(reason) {
    $("#ui-block-div").show();
    console.log(`UI is blocked because of...${reason}`)
}

function unblockUI() {
    $("#ui-block-div").hide();
    console.log("UI has been unblocked")
}

function getAllyTeamUI() {
    return $("#ally-team");
}

function getEnemyTeamUI() {
    return $("#enemy-team");
}

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

function changeTeam() {
    if (mainObjects.currentTeam === mainObjects.teamAlly) {
        changeTeamIndicator(mainObjects.teamEnemy);
        changeCurrentTeamObject(mainObjects.teamEnemy);
        changeCurrentTeamUIObject(getEnemyTeamUI());
    }
    else if (mainObjects.currentTeam === mainObjects.teamEnemy) {
        changeTeamIndicator(mainObjects.teamAlly);
        changeCurrentTeamObject(mainObjects.teamAlly);
        changeCurrentTeamUIObject(getAllyTeamUI());
    }
}

function getNewHeroWritePanel() {
    return $(".write-new-hero");
}

function getOnlyOneAvailableHero(strPattern) {
    result = [];
    for (const hero of mainObjects.heroList) {
        if (hero.name.toLowerCase().startsWith(strPattern)) {
            if (hero.visibility === true) {
                result.push(hero);
            }

            if (result.length > 1) {
                return false;
            }
        }
    }
    if (result.length === 1) {
        return result[0];
    }
}

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

function addHeroToTeam() {
    hero = checkIfThereIsHeroToAdd();
    if (hero) {
        clearWritePanel();
        try {
            mainObjects.currentTeam.addHero(mainObjects.heroToAdd);
        } catch (error) {
            console.log(`Error: ${error}`)

            return;
        }
        finally {
            checkIfThereIsHeroToAdd();
        }
        showTeamHeroes();
        updateVisibilitiesForDoublicates();
        updateIfUpdateAuto();
    }
}

function updateTableHandler() {
    if (mainObjects.blockWhenUpdate) {
        blockUI();

        setTimeout(() => {
            makeRecalculationAndUpdateTable();
            unblockUI()
        }, 10);
    }
    else {
        makeRecalculationAndUpdateTable();
    }
}

const defaultHeroImagePath = "../image/unknown_hero.jpg";

function showTeamHeroes() {
    function showSpecificTeamHeroes(team, uiElements) {
        for (let k = 0; k < uiElements.length; k++) {
            const element = uiElements.eq(k);
            element.attr("data-value", "");
            element.find(".hero-image-default").attr("src", defaultHeroImagePath);
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

function deleteHeroFromTeam(team, dotabuffHeroName) {
    hero = mainObjects.heroList.find((x) => x.dotabuffName === dotabuffHeroName);
    if (hero) {
        team.removeHero(hero);
        showTeamHeroes();
        updateVisibilitiesForDoublicates();
        updateIfUpdateAuto();
    }
}


function bindHeroesFromTeamDelete() {
    $("#ally-team .hero-in-team").on('click', function (e) {
        deleteHeroFromTeam(mainObjects.teamAlly, e.currentTarget.dataset.value);
    });
    $("#enemy-team .hero-in-team").on('click', function (e) {
        deleteHeroFromTeam(mainObjects.teamEnemy, e.currentTarget.dataset.value);
    });
}

function keyBindingAddHeroToTeam() {
    $(document).keydown(function (e) {
        // Enter
        if (e.keyCode === 13) {
            e.preventDefault();
            addHeroToTeam();
        }
    });
}

function clearWritePanel() {
    getNewHeroWritePanel().empty();
}

function keyBindingsWriteNewHero() {
    $(document).keydown(function (e) {
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
    });

    $(document).keydown(function (e) {
        if (e.keyCode === 8) {
            clearWritePanel();
            checkIfThereIsHeroToAdd();
        }
    })
}
function keyBindingsInit() {
    // Tab
    $(document).keydown(function (e) {
        if (e.keyCode === 9) {
            e.preventDefault();
            changeTeam();
        }
    });

    keyBindingsWriteNewHero();
    keyBindingAddHeroToTeam();
}

function bindUpdateTableButton() {
    $(".update-table-button").on('click', (e) => {
        updateTableHandler();
        e.target.blur();
    });
}

function UIBindings() {
    bindHeroesFromTeamDelete();
    bindUpdateTableButton();
}

function checkboxRolesAny(roleUI) {
    if ($(roleUI).is(':checked')) {
        mainObjects.rolesAnySet.add(roleUI.getAttribute("data-value"));
    }
    else {
        mainObjects.rolesAnySet.delete(roleUI.getAttribute("data-value"));
    }
    updateIfUpdateAuto();
}

function checkboxRolesNecessary(roleUI) {
    if ($(roleUI).is(':checked')) {
        mainObjects.rolesNecessarySet.add(roleUI.getAttribute("data-value"));
    }
    else {
        mainObjects.rolesNecessarySet.delete(roleUI.getAttribute("data-value"));
    }
    console.log(mainObjects.rolesNecessarySet);
    updateIfUpdateAuto();
}

function updateIfUpdateAuto() {
    if (mainObjects.updateAuto === true) {
        updateTableHandler();
    }
}

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

    console.log(mainObjects.rolesAnySet);
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

function fillMainPage() {
    fillSettingsWithRoles();
}

function mainPageDefault() {
    clearWritePanel();
    checkIfThereIsHeroToAdd();
}
