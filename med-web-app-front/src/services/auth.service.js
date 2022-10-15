import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL + '/api/auth/';



class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });


    }

    logout(username) {
        axios.get(API_URL + "logout", {headers: authHeader(), params: {"username": username}}
        ).then(r => console.log("logout"));
        localStorage.removeItem("user");
    }

    register(username, initials, firstname, lastname, patronymic, password, chosenRole) {
        return axios.post(API_URL + "signup", {
            username,
            initials,
            firstname,
            lastname,
            patronymic,
            password,
            chosenRole
        });
    }

    checkTokenIsExpired(token) {
        return axios.get(API_URL + "checktoken", {params: {"token": token}})
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();