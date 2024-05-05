import React from "react";

import "./header.css"

import { useAuth } from "../../context/Auth";
import { SortableKey } from "../../data/currency";
import { SortDirection } from "../../API";

import TextField from "components/TextField";
import { ToggleButton } from "components/Button";

export default function Header({
    filter, onFilterChange, sortColumn, onSortChange, sortDirection, aux = [], onLogin, onAuxChange
} : {
    filter: string;
    onFilterChange: (filter: string) => void;
    sortColumn: SortableKey;
    onSortChange: (column: SortableKey) => void;
    sortDirection: SortDirection;
    aux?: string[];
    onLogin?: () => void;
    onAuxChange?: (activeCurrencies: string[]) => void
}) {
    return (
        <thead>
            <tr>
                <th colSpan={20}>
                    <div className="header-container">
                        <TextField
                            placeholder="Filter..."
                            value={filter}
                            onChange={onFilterChange}
                        />
                        <AuxBar currencies={aux} onChange={onAuxChange} onLogin={onLogin}/>
                    </div>
                </th>
            </tr>
            <tr>
                <th className={`sortable ${sortColumn === 'rank' ? sortDirection : ''}`} style={{width: "6em"}}
                    onClick={() => onSortChange("rank")}>Rank
                </th>
                <th className={`sortable ${sortColumn === 'name' ? sortDirection : ''}`}
                    onClick={() => onSortChange("name")}>Name
                </th>
                <th className={`sortable ${sortColumn === 'price' ? sortDirection : ''}`} style={{width: "10em"}}
                    onClick={() => onSortChange("price")}>Price (USD)
                </th>
                {aux.map(currency => (
                    <th key={currency} style={{width: "10em"}}>Price ({currency})</th>
                ))}
            </tr>
        </thead>
    );
}

function AuxBar ({ currencies, onChange, onLogin } : {
    currencies: string[];
    onChange?: (newCurrencies: string[]) => void
    onLogin?: () => void
}) {
    const { state } = useAuth();
    if (state.user.length === 0)
        return (<i>
            Please <a href="#" onClick={onLogin}>Login</a> to control additional currencies
        </i>);

    if (!state.data)
        return (<></>);

    return (<ul className="aux-bar">
        {state.data.currencies.map(currency =>
            <li key={currency.symbol}>
                <ToggleButton {...{
                    toggled: currencies.includes(currency.symbol),
                    onChange: toggled => {
                        if (!onChange)
                            return;

                        const cp = currencies.slice();
                        if (toggled)
                            cp.push(currency.symbol);
                        else {
                            const index = cp.indexOf(currency.symbol);
                            if (index !== -1)
                                cp.splice(index, 1);
                        }

                        onChange(cp);
                    }
                }}
                >{currency.symbol}</ToggleButton>
            </li>
        )}
    </ul>)
}