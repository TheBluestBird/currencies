import React from "react";

import Page, {Props as PageProps} from "./Page";
import { AuthContext } from "../context/Auth";

import Spinner from "../components/Spinner/Spinner";
import TextField from "../components/TextField/TextField";
import Button, { Alignment } from "../components/Button/Button";

interface State {
    userName: string;
    age: number
}

export default class Settings extends Page<PageProps, State> {
    static title = "Settings";
    static path = "/settings";

    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;
    state = {
        userName: "",
        age: 0
    }

    protected renderContent(): React.JSX.Element {
        if (this.context.state.inProgress)
            return (<div className="page-content" style={{
                justifyContent: "center",
                flexGrow: 1
            }}>
                <h2>Attempting to log in, wait just a minute...</h2>
                <Spinner/>
            </div>);

        if (this.context.state.user === '')
            return <div className="page-content" style={{
                justifyContent: "center",
                flexGrow: 1
            }}>
                <h2>This page is for registered users only!</h2>
                <p>To see it you need to <a href="#" onClick={this.props.onLogin}>Login</a> to your account.</p>
                <p>If you don't have an account you may <a href="#" onClick={this.props.onSignup}>Signup</a>!</p>
            </div>

        return <div className="page-content">
            <div className="column">
                <h3>Personal</h3>
                <TextField {...{
                    label: "User name",
                    value: this.state.userName || this.context.state.user,
                    onChange: text => this.setState({userName: text}),
                    placeholder: "Please enter user name"
                }}/>
                <TextField {...{
                    label: "Age",
                    type: "number",
                    value: this.state.age.toString(),
                    onChange: text => this.setState({age: parseInt(text) || 0}),
                    placeholder: "You age"
                }}/>
                <Button align={Alignment.right}>Save</Button>
            </div>
            <div className="column">
                <h3>Currencies</h3>
                <Button align={Alignment.right}>Save</Button>
            </div>
        </div>
    }
}