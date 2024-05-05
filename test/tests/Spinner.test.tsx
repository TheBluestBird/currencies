import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from 'components/Spinner';

describe('Spinner Component', () => {
    test('renders correctly with default size and with no overlay', () => {
        render(<Spinner />);
        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle({ width: '50px', height: '50px' });
        expect(spinner).toHaveClass("spinner");
        expect(document.getElementsByClassName("spinner-overlay").length).toBe(0);
    });

    test('renders correctly with specified size', () => {
        const testSize = 100;
        render(<Spinner size={testSize} />);
        const spinner = screen.getByRole('status');
        expect(spinner).toHaveStyle({ width: testSize + "px", height: testSize + "px" });
    });

    test('renders overlay when withOverlay is true', () => {
        const { container } = render(<Spinner withOverlay={true} />);
        const overlay = container.firstChild;
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveClass("spinner-overlay");
        expect((overlay as ChildNode).firstChild).toHaveClass('spinner');
    });

    test('does not render overlay when withOverlay is false', () => {
        render(<Spinner withOverlay={false} />);
        const spinner = screen.getByRole('status');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('spinner');
        expect(document.getElementsByClassName("spinner-overlay").length).toBe(0);
    });
});