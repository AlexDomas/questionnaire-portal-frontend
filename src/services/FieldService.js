import httpAuthHeaderService from './HttpAuthenticationHeaderService'

const FIELD_DATA = '/fields'
const ID_DATA = '/id'

class FieldService {

    constructor() {
        this.state = {
            userId: false
        }
    }

    getUserId() {
        httpAuthHeaderService.get(ID_DATA)
            .then(response => {
                if (response.data) {
                    localStorage.setItem("userId", response.data)
                }
            })
    }

    getAllFields() {
        if (!this.state.userId) {
            this.getUserId()
            this.state.userId = true
        }
        return httpAuthHeaderService.get(FIELD_DATA)
    }

    getField(pos) {
        return httpAuthHeaderService.get(FIELD_DATA + "/" + pos)
    }

    createField(data) {
        return httpAuthHeaderService.post(FIELD_DATA, data);
    }

    updateField(pos, data) {
        return httpAuthHeaderService.put(FIELD_DATA + "/" + pos, data);
    }

    deleteField(data) {
        return httpAuthHeaderService.delete(FIELD_DATA + "/" + data).then(httpAuthHeaderService.get(FIELD_DATA))

    }
}

export default new FieldService()