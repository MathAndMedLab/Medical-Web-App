// The function takes an array of reviews and its length,
// calculates the sum of the ratings from each review, and
// then divides it by the length, getting the average value.
function GetAvgRating(rvws, len) {
    let avg = 0;
    let savedLen = len;
    for (let i = 0; i < len; i++) {
        if (rvws[i].rating > 0 && rvws[i].rating < 6) {
            avg += rvws[i].rating;
        }
        else {
            savedLen -= 1;
        }
    }
    if (len === 0) {
        return 0
    }
    // Round up to 2 decimal places.
    return (Math.round((avg / savedLen) * 100) / 100)
}

export default GetAvgRating;
