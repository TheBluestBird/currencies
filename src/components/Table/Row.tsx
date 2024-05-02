import React from "react";

import {Currency} from "../../data/currency";

export default function Row ({ currency, others }: {
    currency: Currency,
    others: string[]
}) {
    const values = others.map(other => {
        const value = currency.values.get(other);
        let formatted: string;
        if (value === undefined)
            formatted = "Unknown";
        else
            formatted = format(value);

        return [other, formatted];
    });

    return (<tr>
        <td>{currency.rank}</td>
        <td><b>{currency.name}</b> ({currency.symbol})</td>
        <td>{format(currency.price)}</td>
        {values.map(([key, value]) => (
            <td key={key}>{value}</td>
        ))}
    </tr>);
}
const formatter1 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const formatter2 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
});
const formatter3 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
});

function format (value: number) {
    const abs = Math.abs(value);
    if (abs < 0.0001)
        return formatter3.format(value);
    else if (abs < 10)
        return formatter2.format(value);
    else
        return formatter1.format(value);
}