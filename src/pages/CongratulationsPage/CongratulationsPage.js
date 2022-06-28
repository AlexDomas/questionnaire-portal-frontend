import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";
import AuthService from "../../services/AuthenticationService";

function CongratulationsPage() {
    return (
        <>
            <div className="bg-light" style={{height: '100vh'}}>
                <ProfileNavbar auth={AuthService.getCurrentUser()}/>
                <div className="bg-white mt-4 border m-auto p-4" style={{width: '30vw'}}>
                    <h3 className="text-center mb-3">Thank you!</h3>
                    <p className="text-center">Your response was saved.</p>
                </div>
            </div>
        </>
    )
}

export default CongratulationsPage;