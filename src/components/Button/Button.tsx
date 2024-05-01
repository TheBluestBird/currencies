import React from 'react';
import './button.css';

export default function Button ({
    children, onClick, type = 'button', className = '', disabled = false, fullWidth = false
} : {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    disabled?: boolean;
    fullWidth?: boolean
}) {
    const classNames = [];
    if (fullWidth)
        classNames.push('fw')

    return (
        <button {... {type, className, onClick, disabled}} className={classNames.join(' ')}>
            {children}
        </button>
    );
}