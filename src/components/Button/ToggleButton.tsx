import React from 'react';
import Button, { Props as ButtonProps } from './Button';

interface Props extends ButtonProps {
    toggled?: boolean,
    onChange?: (toggled: boolean) => void
}

export default function ToggleButton (props: Props) {
    const { onChange, toggled, children , className} = props;

    const cls = [className || ""];
    if (toggled)
        cls.push("toggled");

    return (
        <Button {...{
            ...props,
            onClick: () => onChange && onChange(!toggled),
            className: cls.join(" ")
        }}
        >
            {children}
        </Button>
    );
}