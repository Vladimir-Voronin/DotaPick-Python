/**
 * Create recommendation table based on 'DataTables' plugin.
 */
function initRecommendationTable() {
    $("#recommendation-list-table").DataTable({
        paging: false,
        scrollY: 400,
        searching: false,
        order: [1, 'desc'],
        "columns": [
            {
                data: "hero-image",
                render: function (data) {
                    return `<img class="image-full-block"  src=${data}></img>`;
                }
            },
            {
                data: "hero-result",
                render: DataTable.render.number(null, null, 2, null, "%")
            },
            {
                data: "hero-general-winrate",
                render: DataTable.render.number(null, null, 2, null, "%")
            },
            {
                data: "hero-counter-winrate",
                render: DataTable.render.number(null, null, 2, null, "%")
            },
            {
                data: "hero-additional-winrate",
                render: DataTable.render.number(null, null, 2, null, "%")
            },
        ]
    });
}

$(document).ready(() => {
    initRecommendationTable();
});

/**
 * Removing data from recommendation table and updating its view.
 */
function clearRecommendationTable() {
    table = $("#recommendation-list-table").DataTable();
    table.clear().draw();
}

// Dir with default hero images (by dotabuffName).
defaultHeroImagesPath = "../image/resources/default_hero_images/"

/** 
 * Updating recommendation table based on recommendationList.
 */
function updateRecommendationTable() {
    dataArray = [];
    for (const hero of mainObjects.recommendationList.heroList) {
        if (hero.visibility) {
            newRow = {
                "hero-image": defaultHeroImagesPath + hero.image_path.split("\\").pop(),
                "hero-result": hero.getFullWinrateSum(),
                "hero-general-winrate": hero.generalWinrate,
                "hero-counter-winrate": hero.counterWinrate,
                "hero-additional-winrate": hero.additionalWinrate
            };
            dataArray.push(newRow);
        }
    }

    clearRecommendationTable();

    table = $("#recommendation-list-table").DataTable();
    for (const row of dataArray) {
        table.row.add(row);
    }
    table.draw();
}

/**
 * Calls full update inside mainObjects.recommendationList instance and updating recommendation talbe after.
 */
function makeRecalculationAndUpdateTable() {
    mainObjects.recommendationList.fullRecalculation(mainObjects.teamAlly, mainObjects.teamEnemy);
    mainObjects.recommendationList.updateVisibility(
        mainObjects.teamAlly,
        mainObjects.teamEnemy,
        mainObjects.rolesAnySet,
        mainObjects.rolesNecessarySet
    )
    
    updateRecommendationTable();
}