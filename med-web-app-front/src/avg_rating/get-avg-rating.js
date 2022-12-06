// The function takes an array of reviews and its length,
// calculates the sum of the ratings from each review, and
// then divides it by the length, getting the average value.
function GetAvgRating(rvws, len) {
    let avg = 0;
    for (let i = 0; i < len; i++) {

        avg += rvws[i].rating;
    }
    if (len === 0) {
        return 0
    }
    // Round up to 2 decimal places.
    return (Math.round((avg / len) * 100) / 100)
}

export default GetAvgRating;
