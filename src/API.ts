import {Currency, SortableKey} from "./data/currency";

const apiDelay = 2000;

export type CallResult = Promise<{
    result: boolean,
    message?: string
}>;
export type ApiCall = (login: string, password: string) => CallResult;
export interface CallsAPI {
    apiCall: ApiCall
}

type StringMap = {
    [key: string]: string;
};

export async function login (login: string, password: string) {
    return new Promise<string>(function (resolve, reject) {
        setTimeout(() => {
            const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
            const pwd = users[login];
            if (pwd !== password)
                return reject("Couldn't log in into your account");

            resolve(rememberSession(login));
        }, apiDelay);
    });
}

export async function signup (login: string, password: string) {
    return new Promise<string>(function (resolve, reject) {
        setTimeout(() => {
            const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
            if (users[login] !== undefined)
                return reject("This user is already registered");

            users[login] = password;
            localStorage.setItem("users", JSON.stringify(users));

            resolve(rememberSession(login));
        }, apiDelay);
    });
}

export async function logout (id: string) {
    return new Promise<void>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            if (!sessions[id])
                return reject("Couldn't find a session to terminate");

            delete sessions[id];
            localStorage.setItem("sessions", JSON.stringify(sessions));

            resolve();
        }, apiDelay);
    });
}

export async function resumeSession (id: string) {
    return new Promise<string>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            if (!sessions[id])
                return reject("Couldn't find a session with given id");

            resolve(sessions[id]);
        }, apiDelay);
    });
}

function rememberSession (login: string) {
    const id = makeId(10);
    const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
    sessions[id] = login;
    localStorage.setItem("sessions", JSON.stringify(sessions));

    return id;
}

const characters = '0123456789abcdef';
function makeId (length: number) {
    let result = '';
    while (length > 0) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        --length;
    }
    return result;
}

const server = '/api/';
const eps = {
    list: "v1/cryptocurrency/listings/latest"
};

export type SortDirection = 'asc' | 'desc';

const keyConversion = {
    rank: "market_cap",
    name: "name",
    symbol: "symbol",
    price: "price"
};

export async function list (first: number, count: number, sort: SortableKey, direction: SortDirection) {
    const key = keyConversion[sort];
    if (key === "market_cap")
        if (direction === "asc")
            direction = "desc";
        else
            direction = "asc";

    try {
        const result: Currency[] = [];
        while (result.length < count) {
            const url = server + eps.list
                + "?start=" + (first + result.length)
                + "&limit=" + (count - result.length)
                + "&sort=" + key
                + "&sort_dir=" + direction;

            const response = await fetch(url, {
                method: 'GET', // Method is GET
                headers: {
                    'X-CMC_PRO_API_KEY': API_KEY,
                    'Accept': 'application/json',
                }
            });

            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);

            // Parse the JSON response body
            const data = await response.json();
            for (const obj of data.data) {
                const currency = {
                    id: obj.id,
                    symbol: obj.symbol,
                    rank: obj.cmc_rank,
                    name: obj.name,
                    values: new Map<string, number>,
                    price: 0
                }
                for (let key in obj.quote) {
                    if (Object.hasOwn(obj.quote, key)) {
                        if (key === 'USD')
                            currency.price = obj.quote[key].price;
                        else
                            currency.values.set(key, obj.quote[key].price)
                    }
                }

                result.push(currency);
            }
        }

        return result;
    } catch (error) {
        console.error("Failed to fetch data:", error);
        throw error; // Re-throw to handle it later if necessary
    }
}