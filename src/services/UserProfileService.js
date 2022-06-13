import httpAuthHeaderService from './HttpAuthenticationHeaderService'

const USER_EDIT_PROFILE_URL = '/edit_profile'
const USER_CHANGE_PASSWORD_URL = '/change_password'

class UserProfileService {

    getProfileData() {
        return httpAuthHeaderService.get(USER_EDIT_PROFILE_URL);
    }

    updateProfileData(data) {
        return httpAuthHeaderService.put(USER_EDIT_PROFILE_URL, data);
    }

    updatePassword(data) {
        return httpAuthHeaderService.put(USER_CHANGE_PASSWORD_URL, data);
    }

}

export default new UserProfileService()