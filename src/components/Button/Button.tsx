import React from 'react';
import './button.css';

export enum Alignment {
    none,
    left,
    right,
    center
}

export default function Button ({
    children, onClick, type = 'button', className = '', disabled = false, fullWidth = false, align = Alignment.none
} : {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    align?: Alignment
}) {
    const classNames = [];
    if (fullWidth)
        classNames.push('fw')

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
        >
            {children}
        </button>
    );
}