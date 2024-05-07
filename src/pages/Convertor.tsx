import React from "react";

import Page from "./Page";

import TextField from "components/TextField";
import Dropdown from "components/Dropdown";
import Spinner from "components/Spinner";

import { toFormattedString, fromFormattedString, SortableKey } from "../data/currency";
import { Action, CurrencyContext } from "../context/Currencies";
import { list, SortDirection } from "../API";

interface State {
    fromValue: string;
    fromCurrency: string;
    toValue: string;
    toCurrency: string;
    currenciesReady: boolean;
    currencies: string[]
}
const sortColumn:SortableKey = "rank";
const sortDirection:SortDirection = "asc";
const sortId = sortColumn + ":" + sortDirection;

export default class Convertor extends Page<{}, State> {
    static title = "Convertor";
    static path = "/convertor";

    static contextType = CurrencyContext;
    context!: React.ContextType<typeof CurrencyContext>

    state = {
        fromValue: "1",
        fromCurrency: "USD",
        toValue: "1",
        toCurrency: "USD",
        currenciesReady: false,
        currencies: ["USD"]
    }

    renderContent(): React.JSX.Element {
        return (<div className="page-content">
            {!this.state.currenciesReady && <Spinner withOverlay={true}/>}
            <p>Here you can convert the most popular crypto currencies</p>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "1em",
            }}>
                <TextField {...{
                    value: this.state.fromValue,
                    onChange: text => {
                        this.setState({
                            fromValue: text,
                            toValue: this.convert(text)
                        });
                    }
                }}/>
                <Dropdown {...{
                    options: this.state.currencies,
                    onChange: option =>
                        this.setState({
                            fromCurrency: option,
                            toValue: this.convert(this.state.fromValue, false, option)
                        }),
                    placeholder: "Select currency",
                    option: this.state.fromCurrency
                }}
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "1em",
            }}>
                <TextField {...{
                    value: this.state.toValue,
                    onChange: text => {
                        this.setState({
                            fromValue: this.convert(text, true),
                            toValue: text
                        });
                    }
                }} />
                <Dropdown {...{
                    options: this.state.currencies,
                    onChange: option => this.setState({
                        toCurrency: option,
                        fromValue: this.convert(this.state.toValue, true, option)
                    }),
                    placeholder: "Select currency",
                    option: this.state.toCurrency
                }}
                />
            </div>
            <p>
                To start conversion choose the currencies and start typing the values<br/>
                the value in the other field would reflect the amount in other currency.<br/>
                While you're typing in one field the output formatting is applied<br/>
                only to the other field, not to mess up you cursor position.<br/>
                <br/>
                The values are requested once you have opened this page <br/>
                from <a href="https://coinmarketcap.com">coinmarketcap.com</a> and can be out of date.<br/>
                <br/>
                This interface serves purely demonstration purposes,<br/>
                I bear no responsibility for any kind of damage<br/>
                the user might have caused relying on it.
            </p>
        </div>)
    }

    componentDidMount() {
        this.loadCurrencies();
    }

    componentDidUpdate(prevProps: {}, prevState: State) {
        if (!this.state.currenciesReady)
            this.loadCurrencies();
    }

    private loadCurrencies () {
        if (this.context.state.pages === -1)
            return;

        const sorting = this.context.state.getSorting(sortId)
        const page = sorting.getPage(1);
        if (page.loading)
            return;

        let {first, count} = sorting.getNeeded(1);
        if (count === 0) {
            const currencies = this.context.state.getSortedCurrencies(sortId, 1);
            const current = this.state.currencies.slice();
            for (const currency of currencies)
                current.push(currency.symbol);

            this.setState({
                currencies: current,
                currenciesReady: true
            })
            return;
        }

        this.context.dispatch({ type: Action.requestByOrder, sorting: sortId, page: 1 });
        list(first, count, sortColumn, sortDirection).then(currencies => {
            this.context.dispatch({
                type: Action.successByOrder,
                result: currencies,
                sorting: sortId,
                page: 1
            });
        }, error => {
            this.context.dispatch({
                type: Action.failureByOrder,
                message: error,
                sorting: sortId,
                page: 1
            });
        });
    }
    private convert (text: string, reverse: boolean = false, currency?: string) : string {
        const value = fromFormattedString(text);
        const src = currency || (reverse ? this.state.toCurrency : this.state.fromCurrency);
        const dst = reverse ? this.state.fromCurrency : this.state.toCurrency;
        if (value !== value || !src || !dst)
            return "0";

        if (src === dst)
            return toFormattedString(value);

        const source = this.context.state.getCurrenciesByStringField('symbol', src)[0];
        const destination = this.context.state.getCurrenciesByStringField('symbol', dst)[0];

        if (!source) {
            if (!destination) {
                return "0" //TODO conversion from fiat to fiat;
            } else {
                if (src === 'USD')
                    return  toFormattedString(value / destination.price);
                else
                    return "0"; //TODO conversion from fiat to crypto;
            }
        } else {
            if (!destination) {
                if (dst === 'USD')
                    return toFormattedString(source.price * value);
                else
                    return "0" //TODO conversion from crypto to fiat;
            } else {
                return toFormattedString(source.price * value / destination.price);
            }
        }
    }
}