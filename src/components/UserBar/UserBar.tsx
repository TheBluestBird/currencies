import React from "react";

import "./userbar.css"

import Button from "../Button/Button";

import { useAuth, Actions } from "../../AuthContext";
import { logout } from "../../API";

export default function UserBar({onLogIn, onRegister, onInteraction} : {
    onLogIn: () => void,
    onRegister: () => void
    onInteraction: () => void
}) {
    const { state, dispatch} = useAuth();
    const isAuthenticated = state.user !== '';

    return (
        <ul className="userbar">
            {isAuthenticated ? (<>
                <li className="fw"><p>{state.user}</p></li>
                <li className="fw">
                    <Button
                        fullWidth={true}
                        disabled={state.inProgress}
                        onClick={async () => {
                            dispatch({type: Actions.logout});
                            onInteraction();
                            try {
                                await logout(state.sessionId);
                                console.log('Successful logout');
                            } catch (e) {
                                console.error('Unsuccessful logout attempt: ' + e);
                            }
                        }}
                    >Logout</Button>
                </li>
            </>) : (<>
                <li className="fw"><Button fullWidth={true} onClick={() => {
                    onLogIn();
                    onInteraction();
                }} disabled={state.inProgress}>Login</Button></li>
                <li className="fw"><Button fullWidth={true} onClick={() => {
                    onRegister();
                    onInteraction();
                }} disabled={state.inProgress}>Register</Button></li>
            </>)}
        </ul>
    );
}