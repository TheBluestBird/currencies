import React from "react";

import "./userbar.css"

import Button from "../Button/Button";

import { useAuth, Actions } from "../../context/Auth";
import { logout } from "../../API";

export default function UserBar({onLogin, onSignup, onInteraction} : {
    onLogin: () => void,
    onSignup: () => void
    onInteraction: () => void
}) {
    const { state, dispatch} = useAuth();
    const isAuthenticated = state.user !== '';

    return (
        <ul className="userbar">
            {isAuthenticated ? (<>
                <li><p>You are logged in as <b>{state.user}</b></p></li>
                <li>
                    <Button
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
                <li><Button onClick={() => {
                    onLogin();
                    onInteraction();
                }} disabled={state.inProgress}>Login</Button></li>
                <li><Button onClick={() => {
                    onSignup();
                    onInteraction();
                }} disabled={state.inProgress}>Register</Button></li>
            </>)}
        </ul>
    );
}