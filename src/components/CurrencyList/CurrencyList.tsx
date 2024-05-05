import React, {ReactNode} from "react";

import Button from "components/Button";
import TextField from "components/TextField";
import Dropdown from "components/Dropdown";

import { AUX } from "../../data/currency";

const available = ["EUR", "GBP", "JPY"];
const invalidMessage = "You need to fill up all currencies and a comments before doing this";


export default function CurrencyList ({ currencies, onChange, onSave, children } : {
    currencies: AUX[];
    onChange: (newCurrencies: AUX[]) => void;
    onSave?: () => void,
    children?: ReactNode
}) {
    let invalid = false;
    let used = new Set<string>();
    for (const currency of currencies) {
        if (!currency.symbol || !currency.comment)
            invalid = true;

        used.add(currency.symbol);
    }
    const avl = available.filter(symbol => !used.has(symbol))

    return (<div className="column">
        {children}
        {currencies.length === 0 && <p style={{
            margin: 0,
            textAlign: "center"
        }}>
            You don't seem to have any auxiliary currencies added yet.<br/>
            Please, use "+" button to add one!
        </p>}
        {currencies.map((currency, index) =>
            <div className="row" key={currency.symbol}>
                <Dropdown {...{
                   options: avl,
                   option: currency.symbol,
                   onChange: symbol => {
                       const copy = currencies.slice();
                       copy[index].symbol = symbol;
                       onChange(copy);
                   }
                }}/>
                <TextField {...{
                    value: currency.comment,
                    onChange: comment => {
                        const copy = currencies.slice();
                        copy[index].comment = comment;
                        onChange(copy);
                    },
                    placeholder: "Enter a comment"
                }}/>
                <Button {...{
                    onClick: () => {
                        const copy = currencies.slice();
                        copy.splice(index, 1);
                        onChange(copy);
                    },
                    tooltip: "Remove this currency",
                    danger: true
                }}>-</Button>
            </div>
        )}

        <div className="row" style={{
            justifyContent: "space-between"
        }}>
            <Button {...{
                disabled: invalid || avl.length === 0,
                onClick: () => {
                    const copy = currencies.slice();
                    copy.push({symbol: "", comment: ""});
                    onChange(copy);
                },
                tooltip: invalid ?
                    invalidMessage:
                    avl.length === 0 ?
                        "You've added all currencies we could offer":
                        "Add new currency"
            }}
            >+</Button>
            <Button {...{
                disabled: invalid,
                onClick: onSave,
                tooltip: invalid ?
                    invalidMessage:
                    "Save your currencies"
            }}>Save</Button>
        </div>
    </div>)
}