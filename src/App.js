import {Routes, Route} from 'react-router-dom'
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import FieldsPage from "./pages/FieldsPage/FieldsPage";
import EditProfilePage from "./pages/EditProfilePage/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage/ChangePasswordPage";
import QuestionnairePage from "./pages/QuestionnairePage/QuestionnairePage";
import ResponsePage from "./pages/ResponsePage/ResponsePage";

function App() {
  return (
      <>
        <Routes>
            <Route path="/questionnaires">
                <Route path=":questionnaireId" element={<QuestionnairePage/>}/>
            </Route>
            <Route path="/responses" element={<ResponsePage/>}/>
            <Route path="/fields" element={<FieldsPage/>}/>
            <Route path="/change_password" element={<ChangePasswordPage/>}/>
            <Route path="/edit_profile" element={<EditProfilePage/>}/>
            <Route path="/fields" element={<FieldsPage/>}/>
            <Route path="/register" element={<RegistrationPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </>
  );
}

export default App;
