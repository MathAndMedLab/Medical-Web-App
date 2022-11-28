import ReviewService from "./../services/review.service";

async function GetAllReviews(targetId) {

    const response = await (ReviewService.getAllReviews(targetId).then(async response => {
        return response;
    }).catch((e) => {
        console.log(e);
    }));

    return await response.data;
}

export default GetAllReviews;