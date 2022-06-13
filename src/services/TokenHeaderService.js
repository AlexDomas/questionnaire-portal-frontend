
import AuthenticationService from "./AuthenticationService";

export default function getAuthenticationHeader() {
    const user = AuthenticationService.getCurrentUser()
    if (user && user.token) {
        return 'Bearer ' + user.token
    } else {
        return "";
    }
}