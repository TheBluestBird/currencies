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