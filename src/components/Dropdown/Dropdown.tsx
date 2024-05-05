import React, { useState, useEffect, useRef } from 'react';
import './dropdown.css';

export default function Dropdown ({ label, option = "", options = [], onChange, placeholder } : {
    label?: string;
    option?: string;
    options?: string[];
    onChange?: (option: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(option);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggleDropdown = () => {
        if (isOpen || (options && options.length > 0))
            setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        if (onChange)
            onChange(option);

        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside (event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node | null))
                setIsOpen(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {document.removeEventListener('mousedown', handleClickOutside)};
    }, []);

    return (
        <div className="text-input" ref={dropdownRef} >
            {label && <label>{label}</label>}
            <div className={"input-field dropdown-display" + (isOpen ? " open" : "")} onClick={handleToggleDropdown}>
                {selectedOption ?
                    selectedOption :
                    placeholder ?
                        placeholder :
                        <span>&nbsp;</span>
                }
            </div>
            {isOpen && (
                <div className="dropdown-list-container">
                    <ul className="dropdown-list">
                        {options.map(option => (
                            <li key={option} onClick={() => handleOptionClick(option)}>
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};