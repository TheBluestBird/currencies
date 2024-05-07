import React from "react";

import Form, {State as FormState, Props as FormProps} from "./Form";
import TextField from "components/TextField";
import { Link } from "react-router-dom";

import { CallsAPI } from "../API";

interface Props extends FormProps, CallsAPI {}

interface State extends FormState {
    email: string,
    password: string,
    confirm: string
}

export default class Signup extends Form<Props, State> {
    state: State = {
        inProgress: false,
        message: "",
        email: "",
        password: "",
        confirm: ""
    }
    get title() {return "Signup"}

    get valid(): boolean {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0 &&
            this.state.password === this.state.confirm &&
            this.state.email.length < 45
        );
    }
    protected get submitMessage () {
        if (this.state.email.length === 0)
            return "User name can't be empty";

        if (this.state.password.length === 0)
            return "Please enter your password";

        if (this.state.password !== this.state.confirm)
            return "Passwords don't match";

        if (this.state.email.length < 45)
            return "User name is too long";

        return "Create new account";
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
            <TextField
                value={this.state.confirm}
                onChange={value => this.setState({confirm: value})}
                type="password"
                label="Confirm password"
                placeholder="passsword one more time"
                disabled={this.state.inProgress}
            />
        </>);
    }
    protected async onSubmit() {
        this.setState({message: "Signing up..."});

        const res = await this.props.apiCall(this.state.email, this.state.password);
        this.setState({message: res.message || ""});

        return res.result;
    }
    protected renderLastPart() {
        return (<p style={{textAlign: "center", marginBottom: 0}}>
            Already have an account? <Link
            to=""
            onClick={e => {
                e.preventDefault();
                if (this.props.onSwitch)
                    this.props.onSwitch();
            }}
            role="button"
        >Log in!</Link>
        </p>)
    }
}