import axios from "axios";

const API_URL = "http://localhost:8080/api/"

const LOGIN_ENDPOINT = "login"
const REGISTRATION_ENDPOINT = "register"


class AuthService {
    login(email, password) {
        return axios
            .post(
                API_URL + LOGIN_ENDPOINT,
                {
                    email,
                    password
                }
            )
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    register(firstname, lastname, phone, email, password) {
        return axios.post(
            API_URL + REGISTRATION_ENDPOINT,
            {
                phone,
                email,
                password,
                lastname,
                firstname
            }
        ).then(response => {
            return response
        })
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService()