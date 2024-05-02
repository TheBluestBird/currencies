import React, {useEffect, useState} from "react";

import "./table.css"

import {SortableKey} from "../../data/currency";
import {Action, useCurrencies} from "../../context/Currencies";
import {list, SortDirection} from "../../API";

import Row from "./Row"

export default function Table() {
    const { state, dispatch } = useCurrencies();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ sortColumn, setSortColumn ] = useState("rank" as SortableKey);
    const [ sortDirection, setSortDirection ] = useState("asc" as SortDirection);
    const [ currencies, setCurrencies ] = useState([]);

    const sortId = sortColumn + ":" + sortDirection;
    useEffect(() => {
        let {first, count} = state.getSorting(sortId).getNeeded(currentPage);
        if (count === 0)
            return;

        dispatch({ type: Action.requestByOrder, sorting: sortId });
        list(first, count, sortColumn, sortDirection).then(currencies => {
            dispatch({
                type: Action.successByOrder,
                result: currencies,
                sorting: sortId
            });
        }, error => {
            dispatch({
                type: Action.failureByOrder,
                message: error,
                sorting: sortId
            });
        });
    }, [currentPage, sortColumn, sortDirection]);
    function handleSortChange (column: SortableKey) {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }

    function handlePageChange (newPage: number) {
        setCurrentPage(newPage); // Update page
    }

    return (
        <div className="table">
            <table>
                <thead>
                <tr>
                    <th className={`sortable ${sortColumn === 'rank' ? sortDirection : ''}`}
                        onClick={() => handleSortChange("rank")}>Rank
                    </th>
                    <th className={`sortable ${sortColumn === 'name' ? sortDirection : ''}`}
                        onClick={() => handleSortChange("name")}>Name
                    </th>
                    <th className={`sortable ${sortColumn === 'price' ? sortDirection : ''}`}
                        onClick={() => handleSortChange("price")}>Price (USD)
                    </th>
                    {currencies.map(currency => (
                        <th key={currency}>Price ({currency})</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {state.getSortedCurrencies(sortId, currentPage).map(currency => (
                    <Row key={currency.id} currency={currency} others={currencies}/>
                ))}
                </tbody>
            </table>
            <div style={{display: 'flex', justifyContent: 'center', margin: '20px'}}>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
                    Previous
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= 10}>
                    Next
                </button>
            </div>
        </div>
    );
}