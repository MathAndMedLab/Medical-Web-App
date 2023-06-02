import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/notifications/';

class ReviewService {

    getAllNotifications(userId) {
        let params = {};
        if (userId) params["userId"] = userId;
        return axios.get(API_URL + 'all',
            {headers: authHeader(), params: params});
    }

    saveNotification(data, notificationType, notificationLink, userIds) {
        return axios.post(API_URL + 'save',
            {data, notificationType, notificationLink, userIds}, {headers: authHeader()});
    }

    deleteNotification(userId, id) {
        let params = {};
        params["userId"] = userId;
        params["id"] = id;
        return axios.delete(API_URL + "delete", {headers: authHeader(), params: params});
    }
}
export default new ReviewService();