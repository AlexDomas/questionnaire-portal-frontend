import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";
import {Button, Container, Form} from "react-bootstrap";
import React, {Component} from "react";
import UserProfileService from "../../services/UserProfileService";

class ChangePasswordPage extends Component {

    constructor(props) {
        super(props);
        this.onChangeCurrentPassword = this.onChangeCurrentPassword.bind(this)
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this)
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
        this.onHandleSubmit = this.onHandleSubmit.bind(this)
        this.state = {
            currentPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
            message: "",
            success: ""
        }
    }

    onChangeCurrentPassword(e) {
        this.setState({
            currentPassword: e.target.value
        })
    }

    onChangeNewPassword(e) {
        this.setState({
            newPassword: e.target.value
        })
    }

    onChangeConfirmPassword(e) {
        this.setState({
            newPasswordConfirm: e.target.value
        })
    }

    validatePassword = (password) => {
        return String(password).trim().length >= 9 && String(password).trim().length <= 40
    }

    handleValidation() {
        if (!this.state.currentPassword) {
            this.setState({message: "Invalid current password length. Field should have min 9 and max 40 length"})
            return false;
        }
        if (!this.validatePassword(this.state.currentPassword)) {
            this.setState({message: "Invalid current password length. Field should have min 9 and max 40 length"})
            return false;
        }

        if (!this.state.newPassword) {
            this.setState({message: "Invalid new password length. Field should have min 9 and max 40 length"})
            return false
        }
        if (!this.validatePassword(this.state.newPassword)) {
            this.setState({message: "Invalid new password length. Field should have min 9 and max 40 length"})
            return false
        }

        if (!this.state.newPasswordConfirm) {
            this.setState({message: "Invalid confirmation password length. Field should have min 9 and max 40 length"})
            return false;
        }
        if (!this.validatePassword(this.state.newPasswordConfirm)) {
            this.setState({message: "Invalid confirmation password length. Field should have min 9 and max 40 length"})
            return false;
        }

        if (this.state.newPasswordConfirm.localeCompare(this.state.newPassword) !== 0) {
            this.setState({message: "Confirmation new password is not correct"})
            return false
        }

        return true;
    }

    onHandleSubmit(e) {
        e.preventDefault();

        this.setState({
            success: "",
            error: ""
        })

        if (this.handleValidation()) {
            const {currentPassword, newPassword} = this.state
            UserProfileService.updatePassword({currentPassword, newPassword})
                .then(
                    (r) => this.setState(
                        {
                            success: "Password updated successfully"
                        }
                    ),
                    error => {
                        this.setState({message: error.response.data})
                    }
                )
        }
    }

    render() {
        return (
            <>
                <div className="bg-light" style={{height: '100vh'}}>
                    <ProfileNavbar auth={true}/>
                    <Container style={{width: '35vw'}} className="bg-white border mt-4 p-0">
                        <div className="mt-3 m-xl-3 m-sm-3">
                            <h3>Change password</h3>
                        </div>
                        <hr/>
                        <Form noValidate className="px-5 py-4" onSubmit={this.onHandleSubmit}>
                            <Form.Group className="fw-light mb-3" controlId="currentPassword">
                                <Form.Label className="text-muted">
                                    Current Password<span className="text-danger required">*</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="password"
                                              onChange={this.onChangeCurrentPassword}/>
                            </Form.Group>
                            <Form.Group className="fw-light mb-3" controlId="newPassword">
                                <Form.Label className="text-muted">
                                    New Password<span className="text-danger required">*</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="password"
                                              onChange={this.onChangeNewPassword}/>
                            </Form.Group>
                            <Form.Group className="fw-light mb-3" controlId="confirmNewPassword">
                                <Form.Label className="text-muted">
                                    Confirm New Password<span className="text-danger required">*</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="password"
                                              onChange={this.onChangeConfirmPassword}/>
                            </Form.Group>
                            {this.state.message && (
                                <Form.Group className="fw-light mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.message}
                                    </div>
                                </Form.Group>
                            )}
                            {this.state.success && (
                                <Form.Group className="fw-light mb-3">
                                    <div className="alert alert-success" role="alert">
                                        {this.state.success}
                                    </div>
                                </Form.Group>
                            )}
                            <Button className="w-25" variant="primary" type="submit">
                                CHANGE
                            </Button>
                        </Form>
                    </Container>
                </div>
            </>
        )
    }
}

export default ChangePasswordPage;