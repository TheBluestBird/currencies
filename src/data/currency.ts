export interface Currency {
    id: number;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    values: Map<string, number>
}

export interface AUX {
    symbol: string;
    comment: string;
}

export type NumericKey = 'rank' | 'price';
export type StringKey = 'name' | 'symbol';
export type SortableKey = NumericKey | StringKey;
export type IndexableKey = SortableKey;
export type IndexableValue = string | number;

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

export function toFormattedString (value: number): string {
    const abs = Math.abs(value);
    if (abs === 0)
        return '0';
    else if (abs < 0.0000001)
        return value.toExponential(4);
    else if (abs < 0.0001)
        return formatter3.format(value);
    else if (abs < 10)
        return formatter2.format(value);
    else
        return formatter1.format(value);
}

const parsingReg = /,+/g;
export function fromFormattedString (string: string): number {
    const cleanedNumber = string.replace(parsingReg, '');
    return parseFloat(cleanedNumber);
}