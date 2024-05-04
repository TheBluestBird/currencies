import React from "react";

import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import Dropdown from "../Dropdown/Dropdown";

interface Currency {
    symbol: string;
    comment: string;
}

const available = ["EUR", "GBP", "JPY"];

export default function CurrencyList ({ currencies, onChange } : {
    currencies: Currency[];
    onChange: (newCurrencies: Currency[]) => void;
}) {
    let invalid = false
    for (const currency of currencies)
        if (!currency.symbol || !currency.comment) {
            invalid = true;
            break;
        }

    return (<div>
        {currencies.map((currency) =>
            <div>
               <Dropdown {...{
                   key: currency.symbol,
                   options: available,
                   option: currency.symbol,
                   onChange: symbol => {
                       const copy = currencies.slice();

                   }
               }}/>
            </div>
        )}

        <Button
            disabled={invalid}
            onClick={() => {
                const copy = currencies.slice();
                copy.push({symbol: "", comment: ""});
                onChange(copy);
            }}
        >+</Button>
    </div>)
}