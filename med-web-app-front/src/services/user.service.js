import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/search/';


class UserService {

    getUserByUsername(username) {
        return axios.get('api/profile/' + username,
            {headers: authHeader()});
    }

    getContacts(currentUserUsername) {
        let parameters = this.createRequestParamsForGetContacts(currentUserUsername);
        return axios.get(API_URL + 'contacts',
            {headers: authHeader(), params: parameters});
    }

    uploadAvatar(file) {
        let formData = new FormData();

        formData.append("file", file);

        const user = JSON.parse(localStorage.getItem('user'));
        let token = '';
        if (user && user.token) {
            token = user.token;
            console.log("hey hey")
        }
        return axios.post(API_URL + "avatar", formData, {
            headers: {'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token},
        });
    }

    createRequestParamsForGetContacts(currentUserUsername) {
        let params = {};

        if (currentUserUsername) params["currentUserUsername"] = currentUserUsername;
        return params;
    }


    pushContacts(currentUserUsername, selectedUserUsername) {
        return axios.post(API_URL + 'contacts', {currentUserUsername, selectedUserUsername},
            {headers: authHeader()});
    }

    getAllByUsername(username) {
        let parameters = this.createRequestParamsForGetUsername(username);

        return axios.get(API_URL + 'all/username',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetUsername(username) {
        let params = {};

        if (username) params["username"] = username;
        return params;
    }

    getByUsername(username, role) {
        let parameters = this.createRequestParamsForGetUsernameAndRole(username, role);

        return axios.get(API_URL + 'username',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetUsernameAndRole(username, role) {
        let params = {};

        if (username) params["username"] = username;
        if (role) params["role"] = role;
        return params;
    }

    getAllByInitials(initials) {
        let parameters = this.createRequestParamsForGetInitials(initials);

        return axios.get(API_URL + 'all/initials',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetInitials(initials) {
        let params = {};

        if (initials) params["initials"] = initials;
        return params;
    }

    getByInitials(initials, role) {
        let parameters = this.createRequestParamsForGetInitialsAndRole(initials, role);

        return axios.get(API_URL + 'initials',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetInitialsAndRole(initials, role) {
        let params = {};

        if (initials) params["initials"] = initials;
        if (role) params["role"] = role;
        return params;
    }

}

export default new UserService();