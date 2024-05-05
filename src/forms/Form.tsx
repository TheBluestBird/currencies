import React from "react";

import Button from "components/Button";
import Spinner from "components/Spinner";

export interface Props {
    onSuccess?: () => void;
    onError?: () => void;
    onSwitch?: () => void;
}

export interface State {
    message: string;
    inProgress: boolean;
}

export default abstract class Form<P extends Props, S extends State> extends React.Component<P, S> {
    protected abstract renderFields (): React.ReactNode;
    abstract get title(): string | undefined;
    abstract get valid(): boolean;
    protected async onSubmit() : Promise<boolean> {
        return true;
    }

    render () {
        const title = this.title;
        return (<form onSubmit={(e) => {
                e.preventDefault();
                this.submit();
            }} style={{
                display: "flex",
                flexDirection: "column",
                gap: "1em"
            }}>
            {title && (
                <h2 style={{textAlign: "center"}}>{title}</h2>
            )}
            {this.renderFields()}

            <div style={{
                minHeight: 72,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1em"
            }}>
                {this.state.message && <>{this.state.message}</>}
                {this.state.inProgress ?
                    <Spinner size={30}/> :
                    <Button {...{
                        type: "submit",
                        fullWidth: true,
                        disabled: !this.valid || this.state.inProgress,
                        tooltip: this.submitMessage
                    }} >{title || "Submit"}</Button>
                }
            </div>
            {this.renderLastPart()}
        </form>);
    }
    async submit() {
        this.setState({inProgress:  true});
        const result = await this.onSubmit();
        this.setState({inProgress:  false});

        if (result && this.props.onSuccess)
            this.props.onSuccess();
        else if (this.props.onError)
            this.props.onError();

        return result;
    }

    protected renderLastPart() {
        return (<></>);
    }

    protected get submitMessage() {
        return "";
    };
}