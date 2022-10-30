import ReviewService from "./../services/review.service";
import {useEffect, useState} from "react";

const GetReviews = targetId => {

    const [reviews, setReviews] = useState([])

    useEffect(() => {
        ReviewService.getAllReviews(targetId).then(
            async response => {
                return (response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);


    return reviews;
}


export default GetReviews;