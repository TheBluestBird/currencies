import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextField from 'components/TextField';

describe('TextField Component', () => {
    test('renders correctly with default props', () => {
        render(<TextField />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    test('renders with label when provided', () => {
        const label = "Test Label";
        render(<TextField label={label} />);
        expect(screen.getByText(label)).toBeInTheDocument();
        expect(screen.getByLabelText(label)).toBeInTheDocument();
    });

    test('handles onChange event correctly', () => {
        const handleChange = jest.fn();
        render(<TextField onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith('Hello');
    });

    test('can toggle password visibility', () => {
        render(<TextField type="password" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'password');

        const toggleButton = screen.getByText('◎');
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'text');

        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'password');
    });

    test('is disabled when disabled prop is set', () => {
        render(<TextField disabled />);
        const input = screen.getByRole('textbox');
        expect(input).toBeDisabled();
    });
});
