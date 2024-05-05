import React from "react";

import Form, { State as FormState, Props as FormProps } from "./Form";
import TextField from "components/TextField";

import { CallsAPI } from "../API";

interface Props extends FormProps, CallsAPI {}
interface State extends FormState {
    email: string,
    password: string
}

export default class Login extends Form<Props, State> {
    state: State = {
        inProgress: false,
        message: "",
        email: "",
        password: "",
    }
    get title() {return "Login"}

    get valid(): boolean {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }
    protected get submitMessage () {
        if (this.state.email.length === 0)
            return "User name can't be empty";

        if (this.state.password.length === 0)
            return "Please enter your password";

        return "Log in to the system";
    }

    protected renderFields () {
        return (<>
            <TextField
                value={this.state.email}
                onChange={value => this.setState({email: value})}
                placeholder="example@gmail.com"
                label="E-Mail"
                disabled={this.state.inProgress}
            />
            <TextField
                value={this.state.password}
                onChange={value => this.setState({password: value})}
                type="password"
                label="Password"
                placeholder="your passsword"
                disabled={this.state.inProgress}
            />
        </>);
    }
    protected renderLastPart() {
        return (<p style={{textAlign: "center", marginBottom: 0}}>
            Don't have an account? <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    if (this.props.onSwitch)
                        this.props.onSwitch();
                }}
                role="button"
            >Signup!</a>
        </p>)
    }

    protected async onSubmit() {
        this.setState({message: "Logging in..."});

        const result = await this.props.apiCall(this.state.email, this.state.password);
        this.setState({message: result.message || ""});

        return result.result;
    }
}