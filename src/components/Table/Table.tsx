import React, {useEffect, useState} from "react";

import "./table.css"

import {SortableKey} from "../../data/currency";
import {Action, useCurrencies} from "../../context/Currencies";
import {list, quote, SortDirection} from "../../API";

import Header from "./Header";
import Row from "./Row"
import Pagination from "./Pagination"
import Spinner from "components/Spinner";

export default function Table ({ onLogin } : {
    onLogin?: () => void;
}) {
    const { state, dispatch } = useCurrencies();

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ sortColumn, setSortColumn ] = useState("rank" as SortableKey);
    const [ sortDirection, setSortDirection ] = useState("asc" as SortDirection);
    const [ activeAux, setActiveAux ] = useState([] as string[]);
    const [ filter, setFilter] = useState("");

    const sortId = sortColumn + ":" + sortDirection;
    const sorting = state.getSorting(sortId);
    const page = sorting.getPage(currentPage);

    useEffect(() => {
        if (state.pages === -1 || page.loading)
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
                message: error.toString(),
                sorting: sortId,
                page: currentPage
            });
        });
    }, [currentPage, sortColumn, sortDirection, state.pages]);

    useEffect(() => {
        const additional = new Map<string, Set<number>>;
        for (const aux of activeAux) {
            const ids = state.getIdsWithoutAuxCurrency(sortId, currentPage, aux);
            if (ids.size > 0)
                additional.set(aux, ids);
        }
        if (additional.size === 0)
            return;

        dispatch({type: Action.beginEnrich, payload: additional});
        const pr = [];
        const indexToAux = new Map<number, string>;
        let index = 0;
        for (const [aux, ids] of additional) {
            indexToAux.set(index++, aux);
            pr.push(quote(ids, aux));
        }

        Promise.all(pr).then(arr => {
            const result = new Map<string, Map<number, number>>;
            for (let i = 0; i < arr.length; ++i)
                result.set(indexToAux.get(i) as string, arr[i]);

            dispatch({type: Action.successEnrich, payload: result});
        }, err => {
            dispatch({type: Action.failureEnrich, payload: additional});
        })

    }, [activeAux, currentPage, sortId, page.loading]);

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
            {(state.pages === -1 || page.loading) && <Spinner withOverlay={true}/>}
            <table>
                <Header {...{
                    sortColumn, sortDirection, filter, onLogin,
                    aux: activeAux,
                    onAuxChange: setActiveAux,
                    onSortChange: handleSortChange,
                    onFilterChange: setFilter
                }}/>
                <tbody>
                {page.error && <tr className="error"><td colSpan={100}>{page.error}</td></tr>}
                    {state.getSortedCurrencies(sortId, currentPage, filter).map(currency => (
                        <Row {...{
                            currency,
                            key: currency.id,
                            others: activeAux
                        }}/>
                    ))}
                </tbody>
            </table>
            {state.pages > 1 && (
                <Pagination {...{
                    currentPage,
                    totalPages: state.pages,
                    displayedPages: 7,
                    onPageChange: setCurrentPage
                }}/>
            )}
        </div>
    );
}