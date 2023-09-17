/**
 * check is setA is a subset of setB
 */
function isSubSet(setA, setB) {
    for (const elem of setA) {
        if (!setB.has(elem)) {
            return false;
        }
    }
    return true;
}

/**
 * check if at least one elem from setA is in setB
 */
function isAnyInSet(setA, setB) {
    for (const elem of setA) {
        if (setB.has(elem)) {
            return true;
        }
    }
    return false;
}
