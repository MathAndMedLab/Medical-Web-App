function GetAvgRating(rvws, len) {
    let avg = 0;
    for (let i = 0; i < len; i++) {

        avg += rvws[i].rating;
    }
    if (len === 0) {
        return 0
    }
    return (Math.round((avg / len) * 100) / 100)
}

export default GetAvgRating;