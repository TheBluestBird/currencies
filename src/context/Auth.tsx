import React, { createContext, useReducer, useContext, useEffect } from 'react';

import {resumeSession} from "../API";

export enum Actions {
    login,
    logout,
    lock,
    unlock
}

interface AuthState {
    user: string;
    sessionId: string;
    inProgress: boolean;
    currencies: string[];
}
export interface AuthAction {
    type: Actions.login;
    user: string;
    sessionId: string;
    currencies: [];
}
interface SimpleAction {
    type: Actions.logout | Actions.lock | Actions.unlock;
}
type Action = AuthAction | SimpleAction

const initialState: AuthState = {
    user: '',
    sessionId: '',
    inProgress: false,
    currencies: []
};

export const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null
});

function reducer (state: AuthState, action: Action): AuthState {
    switch (action.type) {
        case Actions.login:
            return {
                ...state,
                user: action.user,
                sessionId: action.sessionId,
                inProgress: false
            };
        case Actions.logout:
            return {
                ...state,
                user: '',
                sessionId: '',
                inProgress: false
            };
        case Actions.lock:
            return {
                ...state,
                inProgress: true
            }
        case Actions.unlock:
            return {
                ...state,
                inProgress: false
            }
        default:
            return state;
    }
}

export function AuthProvider ({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const savedSessionId = sessionStorage.getItem('sessionId');
        if (!savedSessionId)
            return;

        dispatch({type: Actions.lock});
        resumeSession(savedSessionId).then(login => {
            dispatch({
                type: Actions.login,
                user: login,
                sessionId: savedSessionId,
                currencies: []
            });
        }, () => {
            dispatch({type: Actions.logout});
        });
    }, []);

    useEffect(() => {
        if (state.sessionId)
            sessionStorage.setItem('sessionId', state.sessionId);
        else
            sessionStorage.removeItem('sessionId');

    }, [state.sessionId]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth () {
    return useContext(AuthContext);
}