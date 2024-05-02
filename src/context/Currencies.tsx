import React, { createContext, useContext, useReducer } from 'react';

import {Currency, IndexableValue, IndexableKey}  from "../data/currency"

const pageSize = 100;

class Sorting implements Iterable<number>{
    private _order: number[] = [];
    private _unique = new Set<number>;
    private _loading = false;
    private _error?: string;

    copy () {
        const srt = new Sorting();
        srt.loading = this.loading;
        srt._order = this._order.slice();
        srt._unique = new Set<number>(this._unique);
        if (this._error)
            srt._error = this._error;

        return srt;
    }
    get loading () { return this._loading }
    set loading (value) {
        this._loading = value;
        if (value && this._error)
            delete this._error;
    }
    get error () {return this._error || ""}
    set error (value: string) {
        this._error = value;
        this._loading = false;
    }
    append (currency: Currency) {
        const sz = this._unique.size;
        this._unique.add(currency.id);
        if (this._unique.size !== sz)
            this._order.push(currency.id)
    }
    [Symbol.iterator]() {
        return new SortIterator(this._order, 0);
    }
    offset (offset: number) {
        return new SortIterator(this._order, offset);
    }
    getNeeded (page: number): {first: number, count: number} {
        let first = this._order.length + 1;
        let count = Math.max(pageSize * page - this._order.length, 0);

        return {first, count}
    }
}
class SortIterator implements Iterator<number>{
    private order: number[];
    private index: number;

    constructor (sorting: number[], index: number) {
        this.order = sorting;
        this.index = index;
    }
    next () : IteratorResult<number> {
        if (this.index < this.order.length)
            return { value: this.order[this.index++], done: false };
        else
            return { done: true, value: undefined };
    }
}

class Index<T extends IndexableValue> {
    public values = new Map<T, Set<number>>;
    private _loading = false;
    private _error?: string;

    addValue (value: T, id: number) {
        let ids: Set<number> | undefined = this.values.get(value);
        if (!ids) {
            ids = new Set<number>()
            this.values.set(value, ids);
        }

        ids.add(id);
    }
    copy () {
        const idx = new Index<T>();
        idx._loading = this._loading;
        idx._error = this._error;

        for (const [value, ids] of this.values)
            idx.values.set(value, new Set(ids));

        return idx;
    }

    get loading () {return this._loading}
    set loading (value) {
        this._loading = value;
        if (value && this._error)
            delete this._error;
    }
    get error () {return this._error || ""}
    set error (value: string) {
        this._error = value;
        this._loading = false;
    }
}
type PossibleIndex = Index<string> | Index<number>;
export class State {
    currencies = new Map<number, Currency>();
    orders = new Map<string, Sorting>;
    indices= new Map<IndexableKey, PossibleIndex>;

    copy () {
        const newState = new State();

        for (const [id, currency] of this.currencies)
            newState.currencies.set(id, {...currency});

        for (const [id, order] of this.orders)
            newState.orders.set(id, order.copy());

        for (const [id, index] of this.indices)
            newState.indices.set(id, index.copy());

        return newState;
    }
    getSorting (sortId: string): Sorting {
        const sorting = this.orders.get(sortId);
        if (sorting)
            return sorting;

        const srt = new Sorting();
        this.orders.set(sortId, srt);

        return srt;
    }
    getIndex<T extends IndexableValue> (field: IndexableKey) {
        const index = this.indices.get(field);
        if (index)
            return index;

        const idx = new Index<T>() as PossibleIndex;
        this.indices.set(field, idx);

        return idx;
    }
    getSortedCurrencies (sortId: string, page: number): Currency[] {
        const sort = this.orders.get(sortId);
        if (!sort)
            return [];

        const result: Currency[] = [];
        const itr = sort.offset((page - 1) * pageSize)
        for (let res = itr.next(); !res.done && result.length < pageSize; res = itr.next())
            result.push(this.currencies.get(res.value) as Currency);

        return result;
    }
}
export enum Action {
    requestByOrder,
    requestByCriteria,
    successByOrder,
    successByCriteria,
    failureByOrder,
    failureByCriteria
}
type CurrencyAction =
    | { type: Action.requestByOrder; sorting: string }
    | { type: Action.requestByCriteria; field: IndexableKey }
    | { type: Action.successByOrder; sorting: string; result: Currency[] }
    | { type: Action.successByCriteria; field: IndexableKey; result: Currency[] }
    | { type: Action.failureByOrder; sorting: string; message: string }
    | { type: Action.failureByCriteria; field: IndexableKey; message: string };

const initialState = new State();

const CurrencyContext = createContext<{
    state: State;
    dispatch: React.Dispatch<CurrencyAction>;
}>({
    state: initialState,
    dispatch: () => undefined, // Placeholder function
});

function currencyReducer (state: State, action: CurrencyAction): State {
    let newState = state.copy();
    switch (action.type) {
        case Action.requestByOrder:
            newState.getSorting(action.sorting).loading = true;
            break;
        case Action.requestByCriteria:
            newState.getIndex<string>(action.field).loading = true;
            break;
        case Action.successByOrder:
            const sorting: Sorting = newState.getSorting(action.sorting);
            sorting.loading = false;
            for (const currency of action.result) {
                newState.currencies.set(currency.id, currency);
                sorting.append(currency);
            }
            index(action.result, newState);
            break;
        case Action.successByCriteria:
            const idx = newState.getIndex<string>(action.field);
            idx.loading = false;
            index(action.result, newState);
            break;
        case Action.failureByOrder:
            newState.getSorting(action.sorting).error = action.message;
            break;
        case Action.failureByCriteria:
            newState.getIndex<string>(action.field).error = action.message;
            break
    }

    return newState;
}

export function CurrencyProvider ({ children } : {
    children: React.ReactNode
}) {
    const [state, dispatch] = useReducer(currencyReducer, initialState);

    return (
        <CurrencyContext.Provider value={{ state, dispatch }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrencies () {
    return useContext(CurrencyContext);
}

function index (currencies: Currency[], state: State) {
    for (const currency of currencies) {
        for (const [field, index] of state.indices) {
            const value = currency[field];
            const i = index as Index<typeof value>;
            i.addValue(value, currency.id);
        }
    }
}