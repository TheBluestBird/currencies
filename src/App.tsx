import React, {useState} from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import NavBar from "components/NavBar";
import Modal from "components/Modal";

import List from "./pages/List";
import Convertor from "./pages/Convertor";
import Settings from "./pages/Settings";

import Login from "./forms/Login";
import Signup from "./forms/Signup";

import FormToAPIProxy, {Actions as APIActions} from "./context/FormToAPIProxy";

enum CurrentModal {
    nothing,
    login,
    register
}

function App() {
    const pages = [List, Convertor, Settings]

    const [currentModal, setCurrentModal] = useState(CurrentModal.nothing);

    function onSignup () {
        setCurrentModal(CurrentModal.register);
    }
    function onLogin () {
        setCurrentModal(CurrentModal.login);
    }

    function onModalClose () {
        setCurrentModal(CurrentModal.nothing);
    }

    return (
        <Router>
            <NavBar {...{
                pages, onSignup, onLogin,
                title: "Currencies demo"
            }}/>
            <Routes>{
                pages.map((Page) => <Route {...{
                    path: Page.path,
                    element: <Page {...{onLogin, onSignup}} />,
                    key: Page.path
                }}/>)
            }</Routes>

            {currentModal == CurrentModal.login &&
                <Modal onClose={onModalClose}>
                    <FormToAPIProxy
                        WrappedComponent={Login}
                        action={APIActions.login}
                        onSuccess={onModalClose}
                        onSwitch={onSignup}
                    />
                </Modal>
            }
            {currentModal == CurrentModal.register &&
                <Modal onClose={onModalClose}>
                    <FormToAPIProxy
                        WrappedComponent={Signup}
                        action={APIActions.signup}
                        onSuccess={onModalClose}
                        onSwitch={onLogin}
                    />
                </Modal>
            }
        </Router>
    );
}

export default App;
