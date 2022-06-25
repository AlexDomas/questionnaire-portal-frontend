import React from 'react'
import { useEffect } from 'react';
import {getNextActiveElement} from "bootstrap/js/src/util";

const AppPagination = ({fieldsPerPage, totalFields, paginate, nextPage, previousPage, currentPage}) => {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalFields / fieldsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (currentPage === Math.ceil(totalFields / fieldsPerPage)) {
            document.getElementById("nextPageId").disabled = true;
        } else if (currentPage === 1) {
            document.getElementById("previousPageId").disabled = true;
        } else {
            document.getElementById("nextPageId").disabled = false;
            document.getElementById("previousPageId").disabled = false;
        }
    }, [previousPage, nextPage]);

    return (
        <div className="d-flex justify-content-center">
            <ul className="pagination">
                <button className="page-link" id="previousPageId" onClick={() => previousPage()}>&#9668;</button>
                {
                    pageNumbers.map(number => (
                        <li className="page-item" key={number}>

                            <a className="page-link active" onClick={() => paginate(number)}>
                                {number}
                            </a>
                        </li>
                    ))
                }
                <button className="page-link" id="nextPageId" onClick={() => nextPage()}>&#9658;</button>

            </ul>

        </div>
    )

}

export default AppPagination