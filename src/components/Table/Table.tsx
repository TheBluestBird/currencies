import React, {useEffect, useState} from "react";

import "./table.css"

import { SortableKey } from "../../data/currency";
import { Action, useCurrencies } from "../../context/Currencies";
import { list, meta, SortDirection } from "../../API";

import Header from "./Header";
import Row from "./Row"
import Pagination from "./Pagination"
import Spinner from "../Spinner/Spinner";

export default function Table() {
    const { state, dispatch } = useCurrencies();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ sortColumn, setSortColumn ] = useState("rank" as SortableKey);
    const [ sortDirection, setSortDirection ] = useState("asc" as SortDirection);
    const [ currencies, setCurrencies ] = useState([] as string[]);
    const [ filter, setFilter] = useState("");

    const sortId = sortColumn + ":" + sortDirection;
    const sorting = state.getSorting(sortId);

    useEffect(() => {
        if (state.pages !== -1)
            return;

        meta().then(function ({active}) {
            dispatch({
                type: Action.setAmountOfRecords,
                amount: active
            });
        })
    }, [state.pages]);

    useEffect(() => {
        if (state.pages === -1)
            return;

        let {first, count} = sorting.getNeeded(currentPage);
        if (count === 0)
            return;

        dispatch({ type: Action.requestByOrder, sorting: sortId, page: currentPage });
        list(first, count, sortColumn, sortDirection).then(currencies => {
            dispatch({
                type: Action.successByOrder,
                result: currencies,
                sorting: sortId,
                page: currentPage
            });
        }, error => {
            dispatch({
                type: Action.failureByOrder,
                message: error,
                sorting: sortId,
                page: currentPage
            });
        });
    }, [currentPage, sortColumn, sortDirection, state.pages]);

    function handleSortChange (column: SortableKey) {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    }

    return (
        <div className="table">
            {(state.pages === -1 || sorting.getPage(currentPage).loading) && <Spinner withOverlay={true}/>}
            <table>
                <Header {...{
                    sortColumn, sortDirection, filter, currencies,
                    onSortChange: handleSortChange,
                    onFilterChange: setFilter
                }}/>
                <tbody>
                    {state.getSortedCurrencies(sortId, currentPage, filter).map(currency => (
                        <Row {...{
                            currency,
                            key: currency.id,
                            others: currencies
                        }}/>
                    ))}
                </tbody>
            </table>
            {state.pages > 1 && (
                <Pagination {...{
                    currentPage,
                    totalPages: state.pages,
                    displayedPages: 8,
                    onPageChange: setCurrentPage
                }}/>
            )}
        </div>
    );
}