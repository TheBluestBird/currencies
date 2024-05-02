import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import NavBar from "./components/NavBar/NavBar";
import Modal from "./components/Modal/Modal";

import List from "./pages/List";
import Convertor from "./pages/Convertor";
import Settings from "./pages/Settings";

import Login from "./forms/Login";
import Signup from "./forms/Signup";

import FormToAPIProxy, {Actions as APIActions} from "./components/FormToAPIProxy";

enum CurrentModal {
    nothing,
    login,
    register
}

function App() {
    const pages = [
        new List({}),
        new Convertor({}),
        new Settings({})
    ]

    const [currentModal, setCurrentModal] = useState(CurrentModal.nothing);

    function onRegister () {
        setCurrentModal(CurrentModal.register);
    }
    function onLogIn () {
        setCurrentModal(CurrentModal.login);
    }

    function onModalClose () {
        setCurrentModal(CurrentModal.nothing);
    }

    return (
        <Router>
            <NavBar {...{pages, onRegister, onLogIn}}/>
            <Routes>{
                pages.map((page) => <Route {...{
                    path: page.path,
                    element: page.render(),
                    key: page.id
                }}/>)
            }</Routes>

            {currentModal == CurrentModal.login &&
                <Modal onClose={onModalClose}>
                    <FormToAPIProxy
                        WrappedComponent={Login}
                        action={APIActions.login}
                        onSuccess={onModalClose}
                        onSwitch={onRegister}
                    />
                </Modal>
            }
            {currentModal == CurrentModal.register &&
                <Modal onClose={onModalClose}>
                    <FormToAPIProxy
                        WrappedComponent={Signup}
                        action={APIActions.signup}
                        onSuccess={onModalClose}
                        onSwitch={onLogIn}
                    />
                </Modal>
            }
        </Router>
    );
}

export default App;
