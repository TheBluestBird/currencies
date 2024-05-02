export interface Currency {
    id: number;
    name: string;
    symbol: string;
    rank: number;
    price: number;
    values: Map<string, number>
}
export type SortableKey = 'name' | 'symbol' | 'rank' | 'price';
export type IndexableKey = 'id' | SortableKey;
export type IndexableValue = string | number;