import http from './HttpAuthenticationHeaderService'

const RESPONSE_DATA = '/responses'

class ResponseService {
    getAllFields() {
        return http.get(RESPONSE_DATA);
    }
}

export default new ResponseService()