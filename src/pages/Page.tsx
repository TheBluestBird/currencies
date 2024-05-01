import React from "react";

let counter = 0;
export default abstract class Page extends React.Component {
    abstract get path () : string;
    abstract get title () : string;

    render() {
        return (
            <div>
                <h1>{this.title}</h1>
            </div>
        );
    }

    get id () {
        return ++counter
    }
}