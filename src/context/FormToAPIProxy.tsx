import React from "react";

import { useAuth, Actions as ContextActions} from "./Auth";
import * as API from "../API"

import { Props as FormProps } from "../forms/Form";

export enum Actions {
    login,
    signup,
    logout
}

interface FormPropsWithAPICall extends API.CallsAPI, FormProps{}

export default function FormToAPIProxy ({WrappedComponent, action, onSuccess, onError, onSwitch} : {
    WrappedComponent: React.ComponentType<FormPropsWithAPICall>
    action: Actions,
    onSuccess?: () => void,
    onError?: () => void,
    onSwitch?: () => void,
}) {
    const { state, dispatch } = useAuth();

    return (
        <WrappedComponent {...{
            onSuccess, onError, onSwitch,
            apiCall: async (login, password) => {
                let info: API.SessionData | undefined;
                dispatch({type: ContextActions.lock});
                try {
                    switch (action) {
                        case Actions.login:
                            info = await API.login(login, password);
                            break;
                        case Actions.signup:
                            info = await API.signup(login, password);
                            break;
                        case Actions.logout:
                            await API.logout(state.sessionId);
                            break;
                    }
                } catch (e) {
                    dispatch({type: ContextActions.unlock})
                    return {
                        result: false,
                        message: e as string
                    };
                }
                if (action !== Actions.logout) {
                    if (!info)
                        return {
                            result: false,
                            message: "Server didn't return valid response"
                        };

                    dispatch({
                        type: ContextActions.login,
                        payload: info
                    });
                } else {
                    dispatch({type: ContextActions.logout});
                }

                return {result: true};
            }
        }}/>
    );
}