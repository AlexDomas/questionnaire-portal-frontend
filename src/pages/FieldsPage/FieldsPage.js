import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";

import React, {Component} from "react";
import AuthService from "../../services/AuthenticationService";
import {Navigate} from "react-router-dom";


class FieldsPage extends Component {

    render() {

        const user = AuthService.getCurrentUser()
        if (!(user && user.token && user.token.toString() !== "null")) {
            return <Navigate to="/login"/>
        }
        return (
            <>
                <div className="bg-light" style={{height: '100vh'}}>
                    <ProfileNavbar auth={true}/>
                </div>
            </>
        )
    }
}

export default FieldsPage;