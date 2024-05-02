import React from "react";

import Page from "./Page";
import Table from "../components/Table/Table";

export default class List extends Page {
    get title () {return "List"}
    get path () {return "/"}

    renderContent() {
        return <Table></Table>
    }
}