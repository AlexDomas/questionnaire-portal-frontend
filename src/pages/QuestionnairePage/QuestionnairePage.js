import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";
import {Button, Container, Form} from "react-bootstrap";
import React, {Component} from "react";
import AuthService from "../../services/AuthenticationService";
import QuestionnaireService from "../../services/QuestionnaireService";
import {Navigate, useParams} from "react-router-dom";
import "../../style.css";

const OPTIONS_DELIMITER = "~!@#%&_&%#@!~";

class QuestionnairePage extends Component {

    constructor(props) {
        super(props);
        this.createAnswerField = this.createAnswerField.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.resetAnswers = this.resetAnswers.bind(this)
        this.state = {
            fields: [],
            answers: [],
            message: "",
            redirect: "",
            param: props.params.questionnaireId.toString()
        }
    }

    resetAnswers() {
        if (!window.location.hash) {
            window.location = window.location + '?r';
            window.location.reload();
        }
    }

    createAnswerField(field) {
        if (!field.active) {
            return ""
        }
        const requiredStar = field.required
            ? <span className="text-danger required"> *</span>
            : "";

        let controlElement = ""

        switch (field.fieldType) {
            case "DATE":
                controlElement = (<input className="form-select" type="date" id="start" name={field.label}/>)
                break
            case "SINGLE_LINE_TEXT":
                controlElement = (<Form.Control name={field.label} className="text-dark" type="text"/>)
                break
            case "MULTILINE_TEXT":
                controlElement = (
                    <Form.Control name={field.label} className="text-dark" type="textarea" as="textarea" rows={5}/>)
                break
            case "RADIO_BUTTON":
                controlElement = field.fieldOptions.replaceAll(OPTIONS_DELIMITER, " ").split(" ")

                    .map((option) => {
                        return (<Form.Check><input
                            className="form-check-input" type="radio" name={field.label} value={option}/>
                            &nbsp;&nbsp;{option}</Form.Check>)
                    })
                break
            case "CHECKBOX":
                controlElement = field.fieldOptions.replaceAll(OPTIONS_DELIMITER, " ").split(" ")
                    .map((option) => {
                        return (<Form.Check><input
                                className="form-check-input" type="checkbox" name={field.label} value={option}/>
                                &nbsp;&nbsp;{option}</Form.Check>
                        )
                    })
                break
            case "COMBOBOX":
                controlElement = (
                    <Form.Select name={field.label}>
                        <option selected disabled hidden>Select option</option>
                        {
                            field.fieldOptions.replaceAll(OPTIONS_DELIMITER, " ").split(" ")
                                .map((option) => {
                                    return (
                                        <option key={option}>{option}</option>
                                    )
                                })
                        }
                    </Form.Select>
                )
                break
        }
        return (
            <Form.Group key={field.label} className="fw-light mb-3">
                <Form.Label className="text-muted fw-bold">{field.label}{requiredStar}</Form.Label>
                {controlElement}
            </Form.Group>
        )
    }

    handleSubmit(e) {

        this.setState({
            message: ""
        })

        const formData = new FormData(e.target);
        e.preventDefault();
        for (let [key, value] of formData.entries()) {
            this.state.answers.push({
                "label": key,
                "value": value
            })
        }

        const result = []
        for (let i = 0; i < this.state.fields.length; i++) {
            const value = this.state.answers.filter((answer) => answer.label === this.state.fields[i].label)
            const value1 = value.map(x => x.value)
            if (!this.state.fields[i].active) {
                result.push({
                    position: (i + 1),
                    value: "N/A"
                })
                continue
            }
            if (this.state.fields[i].required) {
                alert(value1.toString())
                if ((value.length === 0) || (value1.toString() === '')) {
                    this.setState({
                        message: `Required answer for the ${this.state.fields[i].label} field`
                    })
                    return
                } else if ((value.length > 0) && ((this.state.fields[i].fieldType === "COMBOBOX") || (this.state.fields[i].fieldType === "CHECKBOX"))) {
                    result.push({
                        position: (i + 1),
                        value: value.map((v) => v.value).join(", ")
                    })
                } else {
                    result.push({
                        position: (i + 1),
                        value: value[0].value
                    })
                }

            } else {

                if ((value.length === 0) || (value1.toString() === '')) {
                    result.push({
                        position: (i + 1),
                        value: "N/A"
                    })
                } else if ((value.length > 0) && ((this.state.fields[i].fieldType === "COMBOBOX") || (this.state.fields[i].fieldType === "CHECKBOX"))) {
                    result.push({
                        position: (i + 1),
                        value: value.map((v) => v.value).join(", ")
                    })
                } else {
                    result.push({
                        position: (i + 1),
                        value: value[0].value
                    })
                }

            }
        }
        QuestionnaireService.postResponses(this.state.param, result)
            .then(
                (r) => {
                    this.setState({
                        redirect: true
                    })
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )

    }

    componentDidMount() {
        QuestionnaireService.getQuestionnaire(this.state.param)
            .then(
                (r) => {
                    this.setState({
                        fields: r.data,
                    })
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to="/success"/>
        }

        return (
            <>
                <div className="bg-light" style={{height: '100vh'}}>
                    <ProfileNavbar auth={AuthService.getCurrentUser()}/>
                    <Container style={{width: '35vw'}} className="bg-white border mt-4 p-0">
                        <Form noValidate className="px-5 py-4" onSubmit={this.handleSubmit}>
                            {this.state.fields.map((field) => this.createAnswerField(field))}
                            <Button className="w-25" variant="primary" type="submit">
                                SUBMIT
                            </Button>
                            &nbsp;&nbsp;
                            <Button className="w-25" onClick={this.resetAnswers}
                                    variant="secondary">
                                RESET
                            </Button>
                            {this.state.message && (
                                <div className="mt-3 alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            )}
                        </Form>
                    </Container>
                </div>
            </>
        )
    }
}

export default (props) => (
    <QuestionnairePage {...props} params={useParams()}/>
)