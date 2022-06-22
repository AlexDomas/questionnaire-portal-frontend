import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";

import {
    Breadcrumb, BreadcrumbItem,
    Button,
    Col,
    Container,
    Dropdown,
    DropdownButton,
    Form,
    Modal,
    Pagination,
    Row,
    Table
} from "react-bootstrap";
import React, {Component} from "react";
import AuthService from "../../services/AuthenticationService";
import {Navigate} from "react-router-dom";
import FieldService from "../../services/FieldService";
import "../../style.css";

const OPTIONS_DELIMITER = "~!@#%&_&%#@!~";

class FieldsPage extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.setShow = this.setShow.bind(this)
        this.onTypeChange = this.onTypeChange.bind(this)
        this.onLabelChange = this.onLabelChange.bind(this)
        this.onOptionsChange = this.onOptionsChange.bind(this)
        this.onActiveChange = this.onActiveChange.bind(this)
        this.onRequiredChange = this.onRequiredChange.bind(this)
        this.getFieldPosInList = this.getFieldPosInList.bind(this)
        this.deleteField = this.deleteField.bind(this)
        this.getUpdateFieldData = this.getUpdateFieldData.bind(this)
        this.state = {
            show: false,
            page: 0,
            size: 20,
            fields: [],
            modalMessage: "",
            modalSuccess: "",
            message: "",
            successMessage: "",
            label: "",
            fieldType: "COMBOBOX",
            fieldOptions: "",
            required: false,
            active: false,
            update: "",
            questionnaireUrl: "",
        }
    }

    onLabelChange(e) {
        this.setState({
            label: e.target.value
        })
    }

    onTypeChange(e) {
        this.setState({
            fieldType: e.target.value
        })

        if (e.target.value === 'COMBOBOX' || e.target.value === 'RADIO BUTTON') {
            document.getElementById("optionsTextArea").disabled = false;
        } else {
            document.getElementById("optionsTextArea").disabled = true;
        }
    }

    onOptionsChange(e) {
        this.setState({
            fieldOptions: e.target.value
        })
    }

    onRequiredChange(e) {
        this.setState({
            required: e.target.checked
        })
    }

    onActiveChange(e) {
        this.setState({
            active: e.target.checked
        })
    }

    getFieldPosInList(field) {
        return this.state.fields.indexOf(field)
    }

    deleteField(pos) {
        FieldService.deleteField(pos)
            .then(
                (r) => {
                    this.setState({
                        successMessage: "Field was successfully deleted"
                    })
                    FieldService.getAllFields()
                        .then(
                            (r) => {
                                this.setState({
                                    fields: r.data.content,
                                })
                            },
                            error => {
                                this.setState({message: error.response.data})
                            }
                        )
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )
    }

    getUpdateFieldData(pos) {
        this.setState({
            update: pos
        })
        FieldService.getField(pos)
            .then(
                (r) => {
                    if (r.data.fieldOptions) {
                        this.setState({
                            fieldOptions: r.data.fieldOptions.replaceAll(OPTIONS_DELIMITER, "\n")
                        })
                    }
                    this.setState({
                        label: r.data.label,
                        fieldType: r.data.fieldType.replaceAll("_", " "),
                        active: r.data.active,
                        required: r.data.required
                    })
                },
                error => {
                    this.setState({modalMessage: error.response.data})
                }
            )
        this.setShow(true)
    }

    componentDidMount() {
        this.setState({
            questionnaireUrl: AuthService.getUserQuestionnaireUrl()
        })
        FieldService.getAllFields()
            .then(
                (r) => {
                    this.setState({
                        fields: r.data.content,
                    })
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )

    }

    setShow(value) {
        this.setState({
            show: value
        })
    }

    validateInput() {
        if (!this.state.label || this.state.label.length <= 0) {
            this.setState({
                modalMessage: "Label value can not be null"
            })
            return false
        }

        if (!this.state.fieldType) {
            this.setState({
                modalMessage: "Type can not be null"
            })
            return false
        }

        if (this.state.fieldType === 'COMBOBOX' || this.state.fieldType === 'RADIO BUTTON') {
            if (!(this.state.fieldOptions && this.state.fieldOptions.toString().trim().length > 0)) {
                this.setState({
                    modalMessage: "Options can not be empty"
                })
                return false
            }
        }

        return true
    }

    handleSubmit(e) {
        e.preventDefault()

        this.setState({
            modalMessage: "",
            modalSuccess: "",
            successMessage: "",
            message: ""
        })

        if (this.validateInput()) {
            let {label, active, required, fieldType, fieldOptions} = this.state
            fieldType = fieldType.toString().replaceAll(" ", "_")
            fieldOptions = fieldOptions ? fieldOptions.toString().replaceAll("\n", OPTIONS_DELIMITER) : ""
            if (this.state.update) {
                FieldService.updateField(this.state.update, {label, active, required, fieldType, fieldOptions})
                    .then(
                        (r) => {
                            this.setState({
                                label: r.data.label,
                                fieldType: r.data.fieldType,
                                fieldOptions: r.data.fieldOptions,
                                active: r.data.active,
                                required: r.data.required,
                                modalSuccess: "Field was successfully updated",
                            })
                            FieldService.getAllFields()
                                .then(
                                    (r) => {
                                        this.setState({
                                            fields: r.data.content,
                                        })
                                    },
                                    error => {
                                        this.setState({message: error.response.data})
                                    }
                                )
                        },
                        error => {
                            this.setState({modalMessage: error.response.data})
                        }
                    )
            } else {
                FieldService.createField({label, active, required, fieldType, fieldOptions})
                    .then(
                        (r) => {
                            this.setState({
                                modalSuccess: "Field was successfully created",
                                label: "",
                                fieldType: "COMBOBOX",
                                fieldOptions: ""
                            })
                            FieldService.getAllFields()
                                .then(
                                    (r) => {
                                        this.setState({
                                            fields: r.data.content,
                                        })
                                    },
                                    error => {
                                        this.setState({message: error.response.data})
                                    }
                                )
                        },
                        error => {
                            this.setState({
                                modalMessage: error.response.data
                            })
                        }
                    )
            }
        }
    }


    render() {
        const handleClose = () => {
            this.setShow(false);
            this.setState({
                modalMessage: "",
                modalSuccess: "",
                update: "",
                label: "",
                fieldType: "COMBOBOX",
                fieldOptions: "",
                required: false,
                active: false
            })
        }

        const handleShow = () => this.setShow(true);
        const user = AuthService.getCurrentUser()
        if (!(user && user.token && user.token.toString() !== "null")) {
            return <Navigate to="/login"/>
        }

        return (
            <>
                <div className="bg-light" style={{height: '100vh'}}>
                    <ProfileNavbar auth={true}/>
                    <Container style={{width: '80vw'}} className="bg-white border mt-4 p-0">

                        <div className="d-flex justify-content-between p-3">

                            <h3>Fields</h3>

                            <a className="link-questionnaire" href={this.state.questionnaireUrl}><h2>My
                                Questionnaire</h2></a>

                            <Button onClick={handleShow}>
                                <i className="bi bi-plus-lg"></i> ADD FIELD
                            </Button>

                            <Modal
                                show={this.state.show}
                                onHide={handleClose}
                                backdrop="static"
                                keyboard={false}
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>{this.state.update ? "Update field" : "Add Field"}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form noValidate className="p-3">
                                        <Form.Group id="label" className="mb-3">
                                            <Row>
                                                <Col xs={3}>
                                                    <div className="d-flex justify-content-end">
                                                        <Form.Label>
                                                            Label
                                                            <span className="text-danger required">*</span>
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <Form.Control
                                                        value={this.state.label}
                                                        onChange={this.onLabelChange}
                                                        type="input"
                                                    />
                                                </Col>
                                                <Col xs={3}/>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group id="type" className="mb-3">
                                            <Row>
                                                <Col xs={3}>
                                                    <div className="d-flex justify-content-end">
                                                        <Form.Label>
                                                            Type
                                                            <span className="text-danger required">*</span>
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <Form.Select onChange={this.onTypeChange}
                                                                 defaultValue={this.state.fieldType}>
                                                        <option>COMBOBOX</option>
                                                        <option>CHECKBOX</option>
                                                        <option>DATE</option>
                                                        <option>RADIO BUTTON</option>
                                                        <option>MULTILINE TEXT</option>
                                                        <option>SINGLE LINE TEXT</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col xs={3}/>
                                            </Row>
                                        </Form.Group>
                                        <Form.Group id="options" className="mb-3">
                                            <Row>
                                                <Col xs={3}>
                                                    <div className="d-flex justify-content-end">
                                                        <Form.Label>
                                                            Options
                                                        </Form.Label>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <Form.Control id="optionsTextArea"
                                                                  onChange={this.onOptionsChange}
                                                                  as="textarea"
                                                                  value={this.state.fieldOptions}
                                                                  rows={5}
                                                    />
                                                </Col>
                                                <Col xs={3}/>
                                            </Row>
                                        </Form.Group>
                                        <div className="d-flex justify-content-center">
                                            <Row>
                                                <Col>
                                                    <Form.Group id="required">
                                                        <Form.Check
                                                            checked={this.state.required}
                                                            type="checkbox"
                                                            label="Required"
                                                            onChange={this.onRequiredChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col>
                                                    <Form.Group id="isActive">
                                                        <Form.Check
                                                            checked={this.state.active}
                                                            type="checkbox"
                                                            label="Is Active"
                                                            onChange={this.onActiveChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </div>
                                        {this.state.modalMessage && (
                                            <Form.Group className="fw-light mt-3">
                                                <div className="alert alert-danger" role="alert">
                                                    {this.state.modalMessage}
                                                </div>
                                            </Form.Group>
                                        )}
                                        {this.state.modalSuccess && (
                                            <Form.Group className="fw-light mt-3">
                                                <div className="alert alert-success" role="alert">
                                                    {this.state.modalSuccess}
                                                </div>
                                            </Form.Group>
                                        )}
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="white" className="border" style={{width: '100px'}}
                                            onClick={handleClose}>
                                        <p className="fw-bold m-0">CANCEL</p>
                                    </Button>
                                    <Button variant="primary" style={{width: '100px'}} onClick={this.handleSubmit}>
                                        {this.state.update ? "UPDATE" : "SAVE"}
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                        <hr className="m-0"/>
                        <div className="p-3">
                            <Table hover>
                                <thead>
                                <tr>
                                    <th>
                                        <div className="d-inline-block">
                                            Label
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-inline-block">
                                            Type
                                        </div>
                                    </th>
                                    <th>
                                        <div className="d-inline-block">
                                            Required
                                        </div>
                                    </th>
                                    <th colSpan={2}>
                                        <div className="d-inline-block">
                                            Is Active
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.fields.map((field) => (
                                        <tr key={field.label}>
                                            <td>{field.label}</td>
                                            <td>{field.fieldType.toString().replaceAll("_", " ")}</td>
                                            <td>{field.required ? "True" : "False"}</td>
                                            <td>{field.active ? "True" : "False"}</td>
                                            <td className="d-flex justify-content-end">
                                                <div>
                                                    <i className="bi bi-pencil-square"
                                                       onClick={() => this.getUpdateFieldData(this.getFieldPosInList(field) + 1)}></i>
                                                </div>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <div>
                                                    <i className="bi bi-trash-fill"
                                                       onClick={() => this.deleteField(this.getFieldPosInList(field) + 1)}></i>
                                                </div>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </Table>
                            {this.state.message && (
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            )}
                            {this.state.successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {this.state.successMessage}
                                </div>
                            )}
                            <div className="d-flex justify-content-between">
                                <label>1-6 of 6</label>
                                <Pagination>
                                    <Pagination.Prev/>
                                    <Pagination.Item active>{1}</Pagination.Item>
                                    <Pagination.Item>{2}</Pagination.Item>
                                    <Pagination.Next/>
                                </Pagination>
                                <div className="pb-3">
                                    <DropdownButton id="sortingType" title="All" variant="white" className="border">
                                        <Dropdown.Item href="/">Some action</Dropdown.Item>
                                    </DropdownButton>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </>
        )
    }
}

export default FieldsPage;