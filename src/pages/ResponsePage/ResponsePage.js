import {ProfileNavbar} from "../../components/ProfileNavbar/ProfileNavbar";
import {Container, Dropdown, DropdownButton, Pagination, Table} from "react-bootstrap";
import React, {Component} from "react";
import AuthService from "../../services/AuthenticationService";
import {Navigate} from "react-router-dom";
import ResponseService from "../../services/ResponseService";
import FieldService from "../../services/FieldService";
import AppPagination from "../../components/Pagination/AppPagination";
import "../../style.css";
import SockJS from "sockjs-client";
import Stomp from 'stompjs';

class ResponsePage extends Component {
    constructor(props) {
        super(props);
        this.setCurrentPage = this.setCurrentPage.bind(this)
        this.setResponsesPerPage = this.setResponsesPerPage.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.state = {
            loading: false,
            currentPage: 1,
            responsesPerPage: 2,
            fields: [],
            responses: []
        }
    }

    setResponsesPerPage(value) {
        this.setState({
            responsesPerPage: value
        })
    }

    setCurrentPage(value) {
        this.setState({
            currentPage: value
        })
    }

    setLoading(value) {
        this.setState({
            loading: value
        })
    }

    componentDidMount() {

        this.setLoading(true);

        const element = document.querySelector('#select-option');
        element.addEventListener("change", (event) => {
            switch (event.target.value) {
                case "0":
                    this.setResponsesPerPage(this.state.responses.length);
                    this.setCurrentPage(1);
                    break;
                case "1":
                    this.setResponsesPerPage(1);
                    this.setCurrentPage(1);
                    break;
                case "2":
                    this.setResponsesPerPage(2);
                    this.setCurrentPage(1);
                    break;
                case "3":
                    this.setResponsesPerPage(5);
                    this.setCurrentPage(1);
                    break;
                default:
                    this.setResponsesPerPage(10);
                    this.setCurrentPage(1);
                    break;

            }
        });

        ResponseService.getAllFields()
            .then(
                (r) => {
                    this.setState({
                        responses: r.data.content.filter((response) => response.responses.length > 0),
                    })
                    this.setLoading(false);
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )
        FieldService.getAllFields()
            .then(
                (r) => {
                    this.setState({
                        fields: r.data.content,
                    })
                    this.setLoading(false);
                },
                error => {
                    this.setState({message: error.response.data})
                }
            )
        this.connectWebSocket();

    }

    connectWebSocket() {
        alert(1);
        let connection = new SockJS("http://localhost:8080/websocket-questionnaire");
        alert(2);
        let stompClient = Stomp.over(connection);
        alert(3);
        stompClient.connect({}, () => {
            alert(4);
            stompClient.subscribe("/topic/response", (event) => {
                console.log('greeting');
            });
        });
    }

    render() {

        const lastResponseIndex = this.state.currentPage * this.state.responsesPerPage;

        const firstResponseIndex = lastResponseIndex - this.state.responsesPerPage;

        const currentResponse = this.state.responses.slice(firstResponseIndex, lastResponseIndex);

        const paginate = pageNumber => this.setCurrentPage(pageNumber)

        const nextPage = () => this.setCurrentPage(this.state.currentPage + 1)

        const previousPage = () => this.setCurrentPage(this.state.currentPage - 1)

        const user = AuthService.getCurrentUser()
        if (!(user && user.token && user.token.toString() !== "null")) {
            return <Navigate to="/login"/>
        }

        return (
            <>
                <div className="bg-light" style={{height: '100vh'}}>
                    <ProfileNavbar auth={true}/>
                    <Container style={{width: '90vw'}} className="bg-white border mt-4 p-0">
                        <div className="d-flex justify-content-between p-3">
                            <h3>Responses</h3>
                        </div>
                        <hr className="m-0"/>
                        <div className="p-3">
                            <Table id="table" hover>
                                <thead>
                                <tr>
                                    {
                                        this.state.fields.map((field => (
                                            <th key={field.label}>
                                                <div className="d-inline-block">
                                                    {field.label}
                                                </div>
                                            </th>
                                        )))
                                    }
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    currentResponse.map((response) => (
                                        <tr key={response.id}>
                                            {response.responses.map((responseValue) =>
                                                (<td key={responseValue.position}>{responseValue.value || 'N/A'}</td>))}
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

                            <AppPagination
                                fieldsPerPage={this.state.responsesPerPage}
                                totalFields={this.state.responses.length}
                                paginate={paginate}
                                nextPage={nextPage}
                                previousPage={previousPage}
                                currentPage={this.state.currentPage}
                                currentField={currentResponse}
                            />
                        </div>
                    </Container>
                </div>
            </>
        )
    }
}

export default ResponsePage;