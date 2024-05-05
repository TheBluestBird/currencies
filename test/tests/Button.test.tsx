import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Button, { Alignment } from 'components/Button';

describe('Button Component', () => {
    test('renders button with text and class', () => {
        render(<Button className="my-class">Test Button</Button>);
        const button = screen.getByText('Test Button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass("my-class");
    });

    test('triggers onClick when clicked', () => {
        const mockOnClick = jest.fn();
        render(<Button onClick={mockOnClick}>Clickable</Button>);
        fireEvent.click(screen.getByText('Clickable'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is set, has no class if not passed', () => {
        const mockOnClick = jest.fn();
        render(<Button onClick={mockOnClick} disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        fireEvent.click(button);
        expect(button).toBeDisabled();
        expect(mockOnClick).toHaveBeenCalledTimes(0);
        expect(button.classList.length).toBe(0);
    });

    test('has fullWidth style when fullWidth prop is true', () => {
        render(<Button fullWidth>Full Width</Button>);
        const button = screen.getByText('Full Width');
        expect(button).toHaveStyle('width: 100%');
    });

    test('aligns text according to align prop', () => {
        const { rerender } = render(<Button align={Alignment.left}>Aligned Left</Button>);
        let button = screen.getByText('Aligned Left');
        expect(button).toHaveStyle('margin: 0 auto 0 0');

        rerender(<Button align={Alignment.right}>Aligned Right</Button>);
        button = screen.getByText('Aligned Right');
        expect(button).toHaveStyle('margin: 0 0 0 auto');

        rerender(<Button align={Alignment.center}>Aligned Center</Button>);
        button = screen.getByText('Aligned Center');
        expect(button).toHaveStyle('margin: 0 auto');
    });

    test('displays tooltip when tooltip prop is provided', () => {
        render(<Button tooltip="Tooltip info">Button</Button>);
        const button = screen.getByText('Button');
        expect(button).toHaveAttribute('title', 'Tooltip info');
    });
});