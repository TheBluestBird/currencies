import React from "react";

import Page, { Props as PageProps } from "./Page";
import { Actions, AuthContext } from "../context/Auth";
import { updateCurrencies, updatePassword, updatePersonalData } from "../API";

import Spinner from "components/Spinner";
import TextField from "components/TextField";
import Button, { Alignment } from "components/Button";
import CurrencyList from "components/CurrencyList";
import { AUX } from "../data/currency";
import {Link} from "react-router-dom";

interface State {
    userName: string;
    age: number;
    currencies: AUX[];
    password: string;
    confirmation: string;
    currentPassword: string;
    personalInProgress: boolean;
    currenciesInProgress: boolean;
    securityInProgress: boolean;
}

export default class Settings extends Page<PageProps, State> {
    static title = "Settings";
    static path = "/settings";

    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;
    state = {
        userName: "undefined",
        age: NaN,
        currencies: [],
        password: "",
        confirmation: "",
        currentPassword: "",
        personalInProgress: false,
        currenciesInProgress: false,
        securityInProgress: false
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
                <p>To see it you need to <Link to="" onClick={this.props.onLogin}>Login</Link> to your account.</p>
                <p>If you don't have an account you may <Link to="" onClick={this.props.onSignup}>Signup</Link>!</p>
            </div>

        return <div className="page-content" style={{
            alignItems: "stretch",
            alignSelf: "center",
            marginBottom: "1em"
        }}>
            {this.renderPersonal()}
            <hr/>
            {this.renderCurrencyList()}
            <hr/>
            {this.renderSecurity()}
        </div>
    }

    private renderPersonal () {
        return (<div className="column" style={{position: "relative"}}>
            {this.state.personalInProgress && <Spinner withOverlay={true}/>}
            <h3>Personal</h3>
            <TextField {...{
                label: "User name",
                value: this.name,
                onChange: text => this.setState({userName: text}),
                placeholder: "Please enter user name"
            }}/>
            <TextField {...{
                label: "Age",
                type: "number",
                value: this.age,
                onChange: text => this.setState({age: parseInt(text) || 0}),
                placeholder: "You age"
            }}/>
            <Button {...{
                align: Alignment.right,
                onClick: this.savePersonal.bind(this),
                disabled: !this.personalValid,
                tooltip: this.personalMessage
            }}>Save</Button>
        </div>);
    }
    private renderCurrencyList() {
        return (<div className="column" style={{position: "relative"}}>
            <h3>Currencies</h3>
            <CurrencyList {...{
                currencies: this.currencies,
                onChange: newCurrencies => {
                    if (this.state.currenciesInProgress)
                        return;

                    this.setState({
                        currencies: newCurrencies
                    });
                },
                onSave: this.saveCurrencies.bind(this)
            }}>
                {this.state.currenciesInProgress && <Spinner withOverlay={true}/>}
            </CurrencyList>
        </div>);
    }
    private renderSecurity() {
        return (<div className="column" style={{position: "relative"}}>
            {this.state.securityInProgress && <Spinner withOverlay={true}/>}
            <h3>Security</h3>
            <TextField {...{
                label: "Current password",
                type: "password",
                value: this.state.currentPassword,
                onChange: text => this.setState({currentPassword: text})
            }}/>
            <TextField {...{
                label: "New password",
                type: "password",
                value: this.state.password,
                onChange: text => this.setState({password: text})
            }}/>
            <TextField {...{
                label: "Confirmation",
                type: "password",
                value: this.state.confirmation,
                onChange: text => this.setState({confirmation: text})
            }}/>
            <Button {...{
                align: Alignment.right,
                disabled: !this.securityValid,
                tooltip: this.securityMessage,
                onClick: this.saveSecurity.bind(this)
            }}>Save</Button>
        </div>);
    }

    private get name() {
        return this.state.userName === "undefined" ?
            this.context.state.user :
            this.state.userName;
    }

    private get age() {
        if (this.state.age === this.state.age)
            return this.state.age.toString();

        if (this.context.state.data)
            return this.context.state.data.age.toString();

        return "0";
    }

    private get currencies(): AUX[] {
        if (this.state.currencies.length !== 0)
            return this.state.currencies;

        if (this.context.state.data)
            return this.context.state.data.currencies;
        else
            return [];
    }

    private get personalValid() {
        return this.name.length > 0 && this.name.length < 45;
    }

    private get personalMessage() {
        if (this.name.length === 0)
            return "User name can not be empty";

        if (this.name.length > 45)
            return "User name is too long";

        return "Save your personal info";
    }

    private get securityValid() {
        return this.state.password !== "" &&
            this.state.currentPassword !== "" &&
            this.state.password === this.state.confirmation;
    }

    private get securityMessage () {
        if (this.state.password === "")
            return "Enter new password";

        if (this.state.password !== this.state.confirmation)
            return "Passwords don't match";

        if (this.state.currentPassword === "")
            return "Enter current password";

        return "Save your new password";
    }

    private async savePersonal () {
        if (this.state.personalInProgress)
            return;

        this.setState({personalInProgress: true});
        const sessionId = this.context.state.sessionId;
        const newInfo = await updatePersonalData(sessionId, {
            age: parseInt(this.age),
            name: this.name
        });
        this.context.dispatch({
            type: Actions.login,
            payload: {
                ...newInfo,
                sessionId: sessionId
            }
        });
        this.setState({personalInProgress: false});
    }
    private async saveCurrencies () {
        if (this.state.currenciesInProgress)
            return;

        this.setState({currenciesInProgress: true});
        const sessionId = this.context.state.sessionId;
        const newInfo = await updateCurrencies(sessionId, this.currencies);
        this.context.dispatch({
            type: Actions.login,
            payload: {
                ...newInfo,
                sessionId: sessionId
            }
        });
        this.setState({currenciesInProgress: false});
    }
    private async saveSecurity () {
        if (this.state.securityInProgress)
            return;

        this.setState({securityInProgress: true});
        const sessionId = this.context.state.sessionId;

        try {
            await updatePassword(sessionId, this.state.currentPassword, this.state.password);
        } catch (e) {
            this.setState({securityInProgress: false});
            return;
        }

        this.setState({
            securityInProgress: false,
            password: "",
            confirmation: "",
            currentPassword: ""
        });
    }
}