/**
 *  Render function for numbers in recommendation table (>50% - green, <50% - red).
 * @param {Number} data Inner number to render
 * @returns 
 */
function customRenderNumber50Average(data) {
    const postfix = "%";
    const precision = 2;

    if (data >= 50) {
        return `<div class="positive-number">${data.toFixed(precision)}${postfix}</div>`
    }
    else {
        return `<div class="negative-number">${data.toFixed(precision)}${postfix}</div>`
    }
}

/**
 *  Render function for numbers in recommendation table (>0% - green, ===0% - default, <0% - red).
 * @param {Number} data Inner number to render
 * @returns 
 */
function customRenderNumberZeroAverage(data) {
    const postfix = "%";
    const precision = 2;

    if (data > 0) {
        return `<div class="positive-number">${data.toFixed(precision)}${postfix}</div>`
    }
    else if (data === 0) {
        return `<div>${data.toFixed(precision)}${postfix}</div>`
    }
    else {
        return `<div class="negative-number">${data.toFixed(precision)}${postfix}</div>`
    }
}
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
                    return `<img data-value=${data.dotabuffName} class="image-full-block"  src=${defaultHeroImagesPath + data.image_path.split("\\").pop()}></img>`;
                }
            },
            {
                data: "hero-result",
                render: customRenderNumber50Average
            },
            {
                data: "hero-general-winrate",
                render: customRenderNumberZeroAverage
            },
            {
                data: "hero-counter-winrate",
                render: customRenderNumberZeroAverage
            },
            {
                data: "hero-extra-points",
                render: customRenderNumberZeroAverage
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
                "hero-image": hero ,
                "hero-result": hero.getFullWinrateSum(),
                "hero-general-winrate": hero.generalWinrate,
                "hero-counter-winrate": hero.counterWinrate,
                "hero-extra-points": hero.teamCorrectionWinrate + hero.additionalWinrate
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