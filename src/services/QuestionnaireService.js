import axios from "axios";

const API_URL = "http://localhost:8080/api/"
const QUESTIONNAIRE_ENDPOINT = 'questionnaires'

class QuestionnaireService {

    getQuestionnaire(id) {
        return axios.get(
            API_URL + QUESTIONNAIRE_ENDPOINT + "/" + id
        )
    }

}

export default new QuestionnaireService()