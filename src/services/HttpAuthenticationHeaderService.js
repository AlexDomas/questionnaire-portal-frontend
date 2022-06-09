import axios from "axios";
import getAuthenticationHeader from "./TokenHeaderService";

const BASE_URL = "http://localhost:8080/api"


export default axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-type": "application/json",
        "Authorization": getAuthenticationHeader(),
    }
});