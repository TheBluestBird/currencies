import React from 'react';

import "./pagination.css"
import Button from "../Button/Button";

export default function Pagination({ currentPage, totalPages, onPageChange, displayedPages = 10 } : {
    currentPage: number
    totalPages: number,
    onPageChange: (newPage: number) => void,
    displayedPages?: number
}) {
    const pageNumbers = [];

    let startPage = Math.max(currentPage - Math.floor(displayedPages / 2), 1);
    let endPage = Math.min(startPage + displayedPages - 1, totalPages);
    if (endPage === totalPages)
        startPage = Math.max(1, endPage - displayedPages + 1);

    for (let i = startPage; i <= endPage; i++)
        pageNumbers.push(i);

    return (
        <nav>
            <ul className='pagination'>
                <li>
                    <Button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >{"◀"}</Button>
                </li>
                {pageNumbers[0] > 1 && (<li key={1}>
                    <Button
                        onClick={() => onPageChange(1)}
                    >{1}</Button>
                </li>)}
                {pageNumbers[0] > 2 && <li>...</li>}
                {pageNumbers.map(number => (
                    <li key={number}>
                        <Button
                            onClick={() => onPageChange(number)}
                            disabled={number === currentPage}
                        >{number}</Button>
                    </li>
                ))}
                {endPage < totalPages - 1 && <li>...</li>}
                {endPage < totalPages && (<li>
                    <Button
                        onClick={() => onPageChange(totalPages)}
                        disabled={totalPages === currentPage}
                    >{totalPages}</Button>
                </li>)}
                <li>
                    <Button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={totalPages === currentPage}
                    >{"▶"}</Button>
                </li>
            </ul>
        </nav>
    );
}