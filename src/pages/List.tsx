import React from "react";

import Page from "./Page";
import Table from "../components/Table/Table";

export default class List extends Page {
    static title = "List of currencies";
    static path = "/";

    renderContent() {
        return <Table onLogin={this.props.onLogin}/>
    }
}