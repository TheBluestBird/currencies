import React, { useState }  from "react";
import {Link} from "react-router-dom";

import "./navbar.css"
import Page from "../../pages/Page";
import UserBar from "../UserBar/UserBar"

const burger = String.fromCharCode(9776);
const cross = String.fromCharCode(10761);
export default function NavBar ({title = "Title", pages = [], onLogIn, onRegister} : {
    title?: string
    pages?: Page[],
    onLogIn: () => void,
    onRegister: () => void
}) {
    const [isOpen, setIsOpen] = useState(false);

    function close () {
        setIsOpen(false);
    }
    return (
        <nav className={"main" + (isOpen ? " show" : "")}>
            <h1 className="logo">{title}</h1>
            <button className="burger" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? cross : burger}
            </button>
            <div className="bars">
                <ul className="navbar">{
                    pages.map(page => <li key={page.id}>
                        <Link to={page.path} onClick={close}>{page.title}</Link>
                    </li>)
                }</ul>
                <UserBar {...{onLogIn, onRegister, onInteraction: close}}/>
            </div>
        </nav>
    )
};