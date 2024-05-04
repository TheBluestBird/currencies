import React from "react";

import { Currency, toFormattedString } from "../../data/currency";

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
            formatted = toFormattedString(value);

        return [other, formatted];
    });

    return (<tr>
        <td>{currency.rank}</td>
        <td><b>{currency.name}</b> ({currency.symbol})</td>
        <td>{toFormattedString(currency.price)}</td>
        {values.map(([key, value]) => (
            <td key={key}>{value}</td>
        ))}
    </tr>);
}