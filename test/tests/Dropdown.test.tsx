import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from 'components/Dropdown';

describe('Dropdown Component', () => {
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const placeholder = 'Select an option';

    test('renders with a placeholder when no option is selected', () => {
        const { container } = render(<Dropdown options={options} placeholder={placeholder} />);
        expect(screen.getByText(placeholder)).toBeInTheDocument();
        expect(container.getElementsByClassName("input-field dropdown-display")[0]).toBeInTheDocument()
    });

    test('toggles dropdown on click', () => {
        const { container } = render(<Dropdown options={options}/>);
        expect(container.firstChild).toHaveClass("text-input");
        const dropdownDisplay = container.firstChild as ChildNode;
        const field = dropdownDisplay.firstChild as ChildNode;

        fireEvent.click(field);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        fireEvent.click(field);
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    test('calls onChange and closes dropdown when an option is selected', () => {
        const onChange = jest.fn();
        const { container } = render(<Dropdown options={options} onChange={onChange} />);
        const dropdownDisplay = container.firstChild as ChildNode;
        const field = dropdownDisplay.firstChild as ChildNode;

        fireEvent.click(field);
        const option1 = screen.getByText('Option 1');
        expect(option1).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).toBeInTheDocument();
        fireEvent.click(option1);
        expect(onChange).toHaveBeenCalledWith('Option 1');
        expect(screen.queryByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    test('closes dropdown when clicking outside', () => {
        render(<Dropdown options={options} option="Option 1" />);
        const currentValue = screen.getByText("Option 1");

        expect(currentValue).toBeInTheDocument();
        fireEvent.click(currentValue);
        expect(screen.getByText('Option 2')).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    test('renders label if provided', () => {
        const label = "Dropdown Label";
        render(<Dropdown label={label} options={options} />);
        expect(screen.getByText(label)).toBeInTheDocument();
    });
});

