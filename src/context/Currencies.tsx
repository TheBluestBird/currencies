import React, { createContext, useContext, useReducer } from 'react';

import {Currency}  from "../data/currency"

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

export class State {
    currencies = new Map<number, Currency>();
    orders = new Map<string, Sorting>;
    pages = -1;

    copy () {
        const newState = new State();
        newState.pages = this.pages;

        for (const [id, currency] of this.currencies)
            newState.currencies.set(id, {...currency});

        for (const [id, order] of this.orders)
            newState.orders.set(id, order.copy());

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
            newState.getSorting(action.sorting).getPage(action.page).loading = true;
            break;
        case Action.successByOrder:
            const sorting: Sorting = newState.getSorting(action.sorting);
            const page = sorting.getPage(action.page);
            page.loading = false;
            for (const currency of action.result) {
                if (sorting.appendUnique(currency.id)) {
                    newState.currencies.set(currency.id, currency);
                    page.order.push(currency.id)
                }
            }
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

    return (
        <CurrencyContext.Provider value={{ state, dispatch }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrencies () {
    return useContext(CurrencyContext);
}