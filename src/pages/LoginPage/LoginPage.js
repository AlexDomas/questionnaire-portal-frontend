import logo from "../../logo/logo.png"
import React from "react";
import {Button, Col, Form, FormText, Image, Row} from "react-bootstrap";
import {Navigate} from "react-router-dom"
import AuthenticationService from "../../services/AuthenticationService";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.state = {
            email: "",
            password: "",
            message: ""
        };
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

    handleValidation() {
        if (!this.state.email) {
            this.setState({message: "Email cannot be empty"})
            return false;
        }
        if (typeof this.state.email !== "undefined") {
            if (!this.validateEmail(this.state.email)) {
                this.setState({message: "Email is not valid"})
                return false;
            }
        }
        if (!this.state.password && typeof this.state.password !== "undefined") {
            this.setState({message: "Password cannot be empty"});
            return false;
        } else if (this.state.password.length < 8) {
            this.setState({message: "Password length must be greater than 7 symbols"});
            return false;
        }
        return true;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.handleValidation()) {
            AuthenticationService.login(this.state.email, this.state.password)
                .then(
                    () => this.forceUpdate(),
                    error => {
                        this.setState({message: error.response.data})
                    }
                )
        }
    }

    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };


    render() {
        const user = AuthenticationService.getCurrentUser()
        if (user && user.token && user.token.toString() !== "null") {
            return <Navigate to="/fields"/>
        }
        return (
            <>
                <div className="bg-light d-flex justify-content-center" style={{height: '100vh'}}>
                    <div className="border bg-white m-auto p-4" style={{width: '35vw'}}>
                        <Image className="d-block m-auto" src={logo} alt="logo"/>
                        <h3 className="text-center mb-4 mt-3">Log In</h3>
                        <Form noValidate className="p-4" onSubmit={this.handleSubmit}>
                            <Form.Group required className="fw-light mb-3" controlId="email">
                                <Form.Control onChange={this.onChangeEmail} className="text-dark"
                                              type="email" placeholder="Email"/>
                            </Form.Group>
                            <Form.Group required className="fw-light mb-3" controlId="password">
                                <Form.Control onChange={this.onChangePassword} className="text-dark"
                                              type="password" placeholder="Password"/>
                            </Form.Group>
                            <Row className="mb-3">
                                <Col>
                                    <Form.Group>
                                        <Form.Check type="checkbox" label="Remember me"/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="forgotPassword">
                                        <FormText>
                                            <a href="/" className="text-decoration-none fw-bold fs-6">
                                                Forgot your password?
                                            </a>
                                        </FormText>
                                    </Form.Group>
                                </Col>
                            </Row>
                            {this.state.message && (
                                <Form.Group className="fw-light mb-3">
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.message}
                                    </div>
                                </Form.Group>
                            )}
                            <Button className="w-100 mb-3" variant="primary" type="submit">
                                Log In
                            </Button>
                            <div>
                                <p className="text-center">
                                    Don't have account?
                                    <a href="/register" className="text-decoration-none fw-bold m-2">
                                        Sing Up
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

export default LoginPage;