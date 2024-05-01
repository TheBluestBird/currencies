import React, { useState } from 'react';
import "./textfield.css"

export default function TextField ({
    value, onChange, placeholder = '', type = 'text', label, disabled = false
} : {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    label?: string;
    disabled?: boolean
}) {
    const [inputType, setInputType] = useState(type);
    const toggleShowPassword = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
    };

    return (
        <div className="text-input">
            {label && <label>{label}</label>}
            <input {...{
                value, placeholder, disabled,
                type: inputType,
                onChange: e => onChange(e.target.value),
                className: "input-field"
            }}
            />
            {type === 'password' && (
                <span className="toggle-password" onClick={toggleShowPassword}>
                    {inputType === 'password' ? '◎' : '◉'}
                </span>
            )}
        </div>
    );
}