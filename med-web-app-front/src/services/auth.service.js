import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + '/api/auth/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                console.log(response);
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, password, chosenRole) {
        return axios.post(API_URL + "signup", {
            username,
            password,
            chosenRole
        });
    }

    checkTokenIsExpired(token) {
        return axios.get(API_URL + "checktoken",  {params: {"token": token}})
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();