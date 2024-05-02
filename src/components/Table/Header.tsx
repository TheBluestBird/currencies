import React from "react";

import "./header.css"

import { useAuth } from "../../context/Auth";
import { SortableKey } from "../../data/currency";
import { SortDirection } from "../../API";
import TextField from "../TextField/TextField";

export default function Header({ filter, onFilterChange, sortColumn, onSortChange, sortDirection, currencies } : {
    filter: string;
    onFilterChange: (filter: string) => void;
    sortColumn: SortableKey;
    onSortChange: (column: SortableKey) => void;
    sortDirection: SortDirection;
    currencies: string[]
}) {
    const { state } = useAuth();

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
                        {state.user.length === 0 ?
                            <i>Please log in to control additional currencies</i> :
                            <i>Additional currencies</i>
                        }
                    </div>
                </th>
            </tr>
            <tr>
                <th className={`sortable ${sortColumn === 'rank' ? sortDirection : ''}`}
                    onClick={() => onSortChange("rank")}>Rank
                </th>
                <th className={`sortable ${sortColumn === 'name' ? sortDirection : ''}`}
                    onClick={() => onSortChange("name")}>Name
                </th>
                <th className={`sortable ${sortColumn === 'price' ? sortDirection : ''}`}
                    onClick={() => onSortChange("price")}>Price (USD)
                </th>
                {currencies.map(currency => (
                    <th key={currency}>Price ({currency})</th>
                ))}
            </tr>
        </thead>
    );
}