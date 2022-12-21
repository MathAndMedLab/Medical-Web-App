import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/reviews/';

class ReviewService {

    getAllReviews(targetId) {
        let params = {};
        if (targetId) params["targetId"] = targetId;
        return axios.get(API_URL + 'all',
            {headers: authHeader(), params: params});
    }

    saveReview(content, targetId, rating, parent = -1) {
        return axios.post(API_URL + 'save',
            {content, parent, targetId, rating}, {headers: authHeader()});
    }

}

export default new ReviewService()