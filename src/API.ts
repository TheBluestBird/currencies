import { Currency, SortableKey, AUX } from "./data/currency";

const apiDelay = 2000;

export type CallResult = Promise<{
    result: boolean,
    message?: string
}>;
export type ApiCall = (login: string, password: string) => CallResult;
export interface CallsAPI { apiCall: ApiCall }

type StringMap = { [key: string]: string; };
type UserMap = { [key: string]: UserData; };

export interface PersonalData {
    name: string;
    age: number;
}

export class UserData {
    currencies: AUX[] = [];
    age: number = 18;
}

interface RelaxedUserData {
    name: string;
    currencies?: AUX[],
    age?: number
}

export interface UserInfo extends UserData {
    name: string;
}

export interface SessionData extends UserInfo {
    sessionId: string;
}

export async function login (login: string, password: string) {
    return new Promise<SessionData>(function (resolve, reject) {
        setTimeout(() => {
            const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
            const pwd = users[login];
            if (pwd !== password)
                return reject("Couldn't log in into your account");

            resolve({
                ...getUserData(login),
                sessionId: rememberSession(login),
                name: login,
            });
        }, apiDelay);
    });
}

export async function signup (login: string, password: string) {
    return new Promise<SessionData>(function (resolve, reject) {
        setTimeout(() => {
            const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
            if (users[login] !== undefined)
                return reject("This user is already registered");

            users[login] = password;
            localStorage.setItem("users", JSON.stringify(users));

            resolve({
                ...getUserData(login),
                sessionId: rememberSession(login),
                name: login,
            });
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
    return new Promise<UserInfo>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            if (!sessions[id])
                return reject("Couldn't find a session with given id");

            resolve({
                ...getUserData(sessions[id]),
                name: sessions[id],
            });
        }, apiDelay);
    });
}

export async function updatePersonalData (sessionId: string, data: PersonalData) {
    return new Promise<UserInfo>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            if (!sessions[sessionId])
                return reject("Couldn't find a session with given id");

            resolve(setUserData(sessions[sessionId], data));
        }, apiDelay);
    });
}

export async function updateCurrencies (sessionId: string, data: AUX[]) {
    return new Promise<UserInfo>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            const login = sessions[sessionId];
            if (!sessions[sessionId])
                return reject("Couldn't find a session with given id");

            resolve(setUserData(login, {
                name: login,
                currencies: data
            }));
        }, apiDelay);
    });
}

export async function updatePassword (sessionId: string, oldPassword: string, newPassword: string) {
    return new Promise<void>(function (resolve, reject) {
        setTimeout(() => {
            const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
            const login = sessions[sessionId];
            if (!sessions[sessionId])
                return reject("Couldn't find a session with given id");

            const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
            const pwd = users[login];
            if (pwd !== oldPassword)
                return reject("The old password is not correct");

            users[login] = newPassword;
            localStorage.setItem("users", JSON.stringify(users));

            resolve();
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

function getUserData (login: string) {
    const map: UserMap = JSON.parse(localStorage.getItem("data") || "{}");
    return map[login] || new UserData();
}

function setUserData (oldLogin: string, data: RelaxedUserData) {
    const map: UserMap = JSON.parse(localStorage.getItem("data") || "{}");
    const entry = map[oldLogin] || new UserData();

    delete map[oldLogin];

    const newInfo = {...entry, ...data};
    map[data.name] = newInfo;
    localStorage.setItem("data", JSON.stringify(map));

    if (oldLogin !== data.name) {
        const sessions: StringMap = JSON.parse(localStorage.getItem("sessions") || '{}');
        for (const id in sessions) {
            if (Object.hasOwn(sessions, id) && sessions[id] === oldLogin) {
                sessions[id] = newInfo.name;
                break;
            }
        }
        localStorage.setItem("sessions", JSON.stringify(sessions));

        const users: StringMap = JSON.parse(localStorage.getItem("users") || '{}');
        users[newInfo.name] = users[oldLogin];
        delete users[oldLogin];
        localStorage.setItem("users", JSON.stringify(users));
    }

    return newInfo;
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
    list: "v1/cryptocurrency/listings/latest",
    meta: "v1/global-metrics/quotes/latest"
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
                'Accept': 'application/json',
            }
        });

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.status.errorCode)
            throw new Error(data.status.error_message)

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
        if (data.data.length === 0)
            break;
    }

    return result;
}

export async function meta () {
    const res = await fetch(server + eps.meta);
    if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    if (data.status.errorCode)
        throw new Error(data.status.error_message);

    return {
        active: data.data.active_cryptocurrencies as number,
        total: data.data.total_cryptocurrencies as number,
        pairs: data.data.active_market_pairs as number
    }
}