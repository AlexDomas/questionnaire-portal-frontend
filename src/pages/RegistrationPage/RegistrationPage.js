import logo from "../../logo/logo.png"
import {Button, Form, Image} from "react-bootstrap";
import React from "react";
import {Navigate} from "react-router-dom";
import AuthenticationPage from "../../services/AuthenticationService";


class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this)
        this.onChangeFirstname = this.onChangeFirstname.bind(this)
        this.onChangeLastname = this.onChangeLastname.bind(this)
        this.onChangePhone = this.onChangePhone.bind(this)
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            firstname: "",
            lastname: "",
            phone: "",
            message: "",
            registered: false
        };
    }

    onChangeFirstname(e) {
        this.setState({
            firstname: e.target.value
        })
    }

    onChangeLastname(e) {
        this.setState({
            lastname: e.target.value
        })
    }

    onChangePhone(e) {
        this.setState({
            phone: e.target.value
        })
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeConfirmPassword(e) {
        this.setState({
            confirmPassword: e.target.value
        });
    }

    handleValidation() {
        if (!this.state.email && typeof this.state.email !== "undefined") {
            if (!this.validateEmail(this.state.email)) {
                this.setState({message: "Email is not valid"})
                return false;
            }
        }

        if (!this.state.password && typeof this.state.password !== "undefined") {
            this.setState({message: "Password field cannot be empty"});
            return false;
        }
        if (this.state.password.length < 9) {
            this.setState({message: "Password length must be greater, than 8 symbols"});
            return false;
        }

        if ((!this.state.confirmPassword && typeof this.state.confirmPassword !== "undefined")
            || (this.state.confirmPassword.localeCompare(this.state.password) !== 0)) {
            this.setState({message: "Invalid confirm password field"});
            return false;
        }

        if (!this.state.firstname && typeof this.state.firstname !== "undefined") {
            this.setState({message: "Firstname field cannot be empty"});
            return false;
        }
        if (!this.validateNames(this.state.firstname)) {
            this.setState({message: "Firstname field has min 1 and 40 values"});
            return false;
        }

        if (!this.state.lastname && typeof this.state.lastname !== "undefined") {
            this.setState({message: "Lastname field cannot be empty"});
            return false;
        }
        if (!this.validateNames(this.state.lastname)) {
            this.setState({message: "Lastname field has min 1 and max 40 values"});
            return false;
        }

        if (!this.state.phone && typeof this.state.phone !== "undefined") {
            this.setState({message: "Phone number field cannot be empty"});
            return false;
        }
        if (!this.validatePhone(this.state.phone)) {
            this.setState({message: "Phone number has min 8 and 14 max values"});
            return false;
        }

        return true;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.handleValidation()) {
            AuthenticationPage.register(
                this.state.firstname,
                this.state.lastname,
                this.state.phone,
                this.state.email,
                this.state.password
            ).then(
                () => this.setState({registered: true}),
                error => {
                    const errMsg = (error.response && error.response.data && error.response.data.message)
                        || error.message()
                        || error.toString()
                    this.setState({errors: errMsg})
                }
            )
        }
    }

    validateNames = (name) => {
        return String(name).length >= 1 && String(name).length <= 40 && String(name).toLowerCase().match(/[a-zA-Z]+/)
    }

    validatePhone = (phone) => {
        return String(phone).length >= 8 && String(phone).length <= 14 && String(phone).toLowerCase().match(/^(\+)?[0-9]+/)
    }

    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }

    render() {
        if (this.state.registered) {
            return <Navigate to="/login"/>
        }
        return (
            <>
                <div className="bg-light d-flex justify-content-center" style={{height: '100vh'}}>
                    <div className="border bg-white m-auto p-4" style={{width: '35vw'}}>
                        <Image className="d-block m-auto" src={logo} alt="logo"/>
                        <h3 className="text-center mb-1 mt-3">
                            Sign Up
                        </h3>
                        <Form noValidate className="p-3" onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-2" controlId="email">
                                <Form.Label className="text-muted">
                                    Email<span className="text-danger required"> *</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="email"
                                              onChange={this.onChangeEmail}/>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="password">

                                <Form.Label className="text-muted">
                                    Password<span className="text-danger required"> *</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="password"
                                              onChange={this.onChangePassword}/>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="confirmPassword">
                                <Form.Label className="text-muted">
                                    Confirm password<span className="text-danger required"> *</span>
                                </Form.Label>
                                <Form.Control className="text-dark" type="password"
                                              onChange={this.onChangeConfirmPassword}/>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="firstname">
                                <Form.Label className="text-muted">
                                    First Name
                                </Form.Label>
                                <Form.Control className="text-dark" type="text"
                                              onChange={this.onChangeFirstname}/>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="lastname">
                                <Form.Label className="text-muted">
                                    Last name
                                </Form.Label>
                                <Form.Control className="text-dark" type="text"
                                              onChange={this.onChangeLastname}/>
                            </Form.Group>
                            <Form.Group className="fw-light mb-2" controlId="phone" onChange={this.onChangePhone}>
                                <Form.Label className="text-muted">
                                    Phone Number
                                </Form.Label>
                                <Form.Control type="input"/>

                            </Form.Group>
                            {this.state.message && (
                                <Form.Group className="fw-light mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.message}
                                    </div>
                                </Form.Group>
                            )}
                            <Button className="w-100 mb-3" variant="primary" type="submit">
                                Sign Up
                            </Button>
                            <div>
                                <p className="text-center">
                                    Already have account?
                                    <a href="/login" className="text-decoration-none fw-bold m-2">
                                        Log In
                                    </a>
                                </p>
                            </div>
                        </Form>
                    </div>
                </div>
            </>
        )
    }
}

export default RegistrationPage;