import React from "react";

let counter = 0;
export default abstract class Page extends React.Component {
    abstract get path () : string;
    abstract get title () : string;

    render () {
        return (
            <div style={{
                height: "100%",
                overflow: "auto"
            }}>
                <h1 style={{
                    textAlign: "center"
                }}>{this.title}</h1>
                {this.renderContent()}
            </div>
        );
    }

    renderContent () {
        return <></>
    }

    get id () {
        return ++counter
    }
}