import React, { createContext, useContext, useEffect, useReducer } from 'react';

import {Currency, IndexableKey, IndexableValue, StringKey} from "../data/currency"
import { meta } from "../API";

const pageSize = 100;

class Page {
    order: number[] = [];
    private _loading = false;
    private _error?: string;

    copy () {
        const pg = new Page();
        pg.order = this.order.slice();
        pg._loading = this._loading;
        if (this._error)
            pg._error = this._error;

        return pg;
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
}

class Sorting {
    private pages = new Map<number, Page>;
    private _unique = new Set<number>;

    copy () {
        const srt = new Sorting();
        srt._unique = new Set<number>(this._unique);
        for (const [number, page] of this.pages)
            srt.pages.set(number, page.copy());

        return srt;
    }
    append (currency: Currency, page: number) {
        if (this.appendUnique(currency.id))
            this.getPage(page).order.push(currency.id);
    }
    appendBulk (entries: Currency[], page: number) {
        let currentPage = this.getPage(page);
        for (const currency of entries) {
            if (this.appendUnique(currency.id))
                currentPage.order.push(currency.id);
        }
    }
    appendUnique (id: number) {
        const sz = this._unique.size;
        this._unique.add(id);
        return sz !== this._unique.size
    }

    getNeeded (page: number): {first: number, count: number} {
        const pg = this.getPage(page);
        const first = pageSize * (page - 1) + 1 + pg.order.length;
        const count = Math.max(pageSize - pg.order.length, 0);

        return {first, count}
    }
    getPage (index: number) {
        const page = this.pages.get(index);
        if (page)
            return page;

        const pg = new Page();
        this.pages.set(index, pg);
        return pg;
    }
}

class Index<T extends IndexableValue> {
    public values = new Map<T, Set<number>>;
    private _loading = false;
    private _error?: string;

    addValue (value: T, id: number) {
        let ids: Set<number> | undefined = this.values.get(value);
        if (!ids) {
            ids = new Set<number>([id])
            this.values.set(value, ids);
            return;
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
    indices = new Map<IndexableKey, PossibleIndex>;
    pages = -1;

    copy () {
        const newState = new State();
        newState.pages = this.pages;

        for (const [id, currency] of this.currencies)
            newState.currencies.set(id, {...currency});

        for (const [id, order] of this.orders)
            newState.orders.set(id, order.copy());

        for (const [field, index] of this.indices)
            newState.indices.set(field, index.copy());

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
    getSortedCurrencies (sortId: string, page: number, filter: string = ""): Currency[] {
        const sort = this.orders.get(sortId);
        if (!sort)
            return [];

        const result: Currency[] = [];
        const pg = sort.getPage(page);
        for (const id of pg.order) {
            const currency = this.currencies.get(id) as Currency;
            if (State.satisfies(currency, filter))
                result.push(currency);
        }

        return result;
    }
    //dammit! I need specialization here!
    getCurrenciesByStringField (field: StringKey, value: string) : Currency[] {
        let index = this.indices.get(field);
        if (!index) {
            index = new Index<string>();
            for (const [id, currency] of this.currencies)
                index.addValue(currency[field], id);
        }

        let ids = (index as Index<string>).values.get(value);
        if (!ids)
            return [];

        const result = [];
        for (const id of ids)
            result.push(this.currencies.get(id) as Currency);

        return result;
    }
    successByOrder (sorting: string, page: number, result: Currency[]) {
        const srt = this.getSorting(sorting);
        const pg = srt.getPage(page);
        pg.loading = false;
        for (const currency of result) {
            if (srt.appendUnique(currency.id)) {
                this.currencies.set(currency.id, currency);
                pg.order.push(currency.id);

                for (const [field, index] of this.indices) {
                    const value = currency[field];
                    if (typeof value === 'string')
                        (index as Index<string>).addValue(value, currency.id);
                    else
                        (index as Index<number>).addValue(value, currency.id);
                }
            }
        }
    }

    static satisfies (currency: Currency, filter: string) {
        if (!filter.length)
            return true;

        filter = filter.toLowerCase();
        if (currency.symbol.toLowerCase().indexOf(filter) !== -1)
            return true;

        return currency.name.toLowerCase().indexOf(filter) !== -1;
    }
}
export enum Action {
    requestByOrder,
    successByOrder,
    failureByOrder,
    setAmountOfRecords
}
type CurrencyAction =
    | { type: Action.requestByOrder; sorting: string, page: number }
    | { type: Action.successByOrder; sorting: string; result: Currency[], page: number }
    | { type: Action.failureByOrder; sorting: string; message: string, page: number }
    | { type: Action.setAmountOfRecords; amount: number }

const initialState = new State();

export const CurrencyContext = createContext<{
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
            newState.getSorting(action.sorting).getPage(action.page).loading = true;
            break;
        case Action.successByOrder:
            newState.successByOrder(action.sorting, action.page, action.result);
            break;
        case Action.failureByOrder:
            newState.getSorting(action.sorting).getPage(action.page).error = action.message;
            break;
        case Action.setAmountOfRecords:
            newState.pages = Math.ceil(action.amount / pageSize);
            break;
    }

    return newState;
}

export function CurrencyProvider ({ children } : {
    children: React.ReactNode
}) {
    const [state, dispatch] = useReducer(currencyReducer, initialState);
    useEffect(() => {
        meta().then(function ({active}) {
            dispatch({
                type: Action.setAmountOfRecords,
                amount: active
            });
        }, function (error) {
            console.error(error);
            dispatch({
                type: Action.setAmountOfRecords,
                amount: 0
            });
        })
    }, []);

    return (
        <CurrencyContext.Provider value={{ state, dispatch }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrencies () {
    return useContext(CurrencyContext);
}