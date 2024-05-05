import React from 'react';
import './button.css';

export enum Alignment {
    none,
    left,
    right,
    center
}

export interface Props {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    align?: Alignment;
    tooltip?: string;
    danger?: boolean;
}

export default function Button ({
    children, onClick, type = 'button', className = '', disabled = false,
    fullWidth = false, align = Alignment.none, tooltip = '', danger = false
} : Props) {
    const classNames = [];
    if (className)
        classNames.push(className);

    if (fullWidth)
        classNames.push('fw')

    if (danger)
        classNames.push("danger");

    className = classNames.join(" ");

    let margin = "";
    switch (align) {
        case Alignment.left:
            margin = "0 auto 0 0";
            break;
        case Alignment.right:
            margin = "0 0 0 auto";
            break;
        case Alignment.center:
            margin = "0 auto";
            break;
    }
    return (

        <button
            {... {type, className, onClick, disabled}}
            style={{
                width: fullWidth ? "100%" : "",
                margin: margin
            }}
            title={tooltip}
        >
            {children}
        </button>
    );
}