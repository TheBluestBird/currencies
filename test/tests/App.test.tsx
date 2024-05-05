import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../src/App';

test('Renders the app', () => {
  const { container, getByRole } = render(<App />);
  //const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
  // expect(getByRole('main')).toBeInTheDocument();
  //expect(container).toMatchSnapshot();
});
