import React from "react";

export interface Props {
    onLogin?: () => void
    onSignup?: () => void
}

export default abstract class Page<P extends Props = Props, S = {}> extends React.Component<P, S> {
    static title: string;
    static path: string;
    props!: P;

    render () {
        return (
            <div className="page">
                <h1 style={{
                    textAlign: "center"
                }}>{(this.constructor as typeof Page).title}</h1>
                {this.renderContent()}
            </div>
        );
    }

    protected renderContent () {
        return <div className="page-content"></div>
    }
}