import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/search/';


class UserService {

    constructor(props) {
        this.createRequestParamsForGetUsername = this.createRequestParamsForGetUsername.bind(this);
        this.createRequestParamsForGetInitials = this.createRequestParamsForGetInitials.bind(this);
    }

    getAllByUsername(username) {
        let parameters = this.createRequestParamsForGetUsername(username);

        return axios.get(API_URL + 'all/usersByUsername',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetUsername(username) {
        let params = {};

        if (username) params["username"] = username;
        return params;
    }

    // getAllByInitials(lastname, firstname) {
    //     let parameters = this.createRequestParamsForGetInitials(lastname, firstname);
    //
    //     return axios.get(API_URL + 'all/usersByInitials',
    //         {headers: authHeader(), params: parameters});
    // }

    getAllByInitials(initials) {
        let parameters = this.createRequestParamsForGetUsername(initials);

        return axios.get(API_URL + 'all/usersByInitials',
            {headers: authHeader(), params: parameters});
    }

    createRequestParamsForGetInitials(initials) {
        let params = {};

        if (initials) params["initials"] = initials;
        return params;
    }

    // createRequestParamsForGetInitials(lastname, firstname) {
    //     let params = {};
    //
    //     if (lastname) params["lastname"] = lastname;
    //     if (firstname) params["firstname"] = firstname;
    //     return params;
    // }

}

export default new UserService();