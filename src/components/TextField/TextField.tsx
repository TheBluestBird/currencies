import React, {HTMLInputTypeAttribute, useState} from 'react';
import "./textfield.css"

let counter = 0;
export default function TextField ({
    value = "", onChange, placeholder = '', type = 'text', label, disabled = false
} : {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    label?: string;
    disabled?: boolean;
}) {
    const [inputType, setInputType] = useState(type);
    const toggleShowPassword = () => {
        if (!disabled)
            setInputType(inputType === 'password' ? 'text' : 'password');
    };

    return (
        <div className="text-input">
            {label && <label htmlFor={"input" + counter}>{label}</label>}
            <input role="textbox" id={"input" + counter++} {...{
                value, placeholder, disabled,
                type: inputType,
                onChange: e => onChange && onChange(e.target.value),
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