import React from 'react'
import {useEffect} from 'react';
import {Button, Container, Form} from "react-bootstrap";
import "../../style.css";

const AppPagination = ({fieldsPerPage, totalFields, paginate, nextPage, previousPage, currentPage}) => {

    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalFields / fieldsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
            if(currentPage === 1 && currentPage === Math.ceil(totalFields / fieldsPerPage)){
                document.getElementById("previousPageId").disabled = true;
                document.getElementById("previousPageId").style.color = "#808080";
                document.getElementById("nextPageId").disabled = true;
                document.getElementById("nextPageId").style.color = "#808080";
            }
            else if(currentPage === Math.ceil(totalFields / fieldsPerPage)) {
                document.getElementById("nextPageId").disabled = true;
                document.getElementById("nextPageId").style.color = "#808080";
                document.getElementById("previousPageId").disabled = false;
                document.getElementById("previousPageId").style.color = "#0d6efd";
                console.log(1);
            } else if (currentPage === 1) {
                document.getElementById("previousPageId").disabled = true;
                document.getElementById("previousPageId").style.color = "#808080";
                document.getElementById("nextPageId").disabled = false;
                document.getElementById("nextPageId").style.color = "#0d6efd";
                console.log(2);
            } else {
                document.getElementById("nextPageId").disabled = false;
                document.getElementById("nextPageId").style.color = "#0d6efd";
                document.getElementById("previousPageId").disabled = false;
                document.getElementById("previousPageId").style.color = "#0d6efd";
                console.log(4);
            }
        }, [currentPage, previousPage, nextPage]
    )
    ;

    return (
        <div className="d-flex justify-content-center">
            <a className="infoFields">1 - {fieldsPerPage} of {totalFields}</a>
            <ul className="pagination">
                <button className="page-link" id="previousPageId" onClick={() => previousPage()}>&#9668;</button>
                {
                    pageNumbers.map(number => (
                        <li className="page-item" key={number}>

                            <button className="page-link" id="idPageNumber" onClick={() => paginate(number)}>
                                {number}
                            </button>
                        </li>
                    ))
                }
                <button className="page-link" id="nextPageId" onClick={() => nextPage()}>&#9658;</button>

            </ul>
            <Form.Select id="select-option">
                <option value="0">All</option>
                <option value="1">1</option>
                <option value="2" selected>2</option>
                <option value="3">5</option>
                <option value="4">10</option>
            </Form.Select>

        </div>
    )

}

export default AppPagination