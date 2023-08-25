/**
 * check is set_a is a subset of set_b
 */
isSubSet(set_a, set_b) {
    for (const elem in set_a) {
        if (!set_b.has(elem)) {
            return false;
        }
    }
    return true;
}