import { render, screen } from '@testing-library/react';
import App from './App';

test('renders text splitter app', () => {
  render(<App />);
  const titleElement = screen.getByText(/divisor de textos/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders configuration section', () => {
  render(<App />);
  const configElement = screen.getByText(/configuración/i);
  expect(configElement).toBeInTheDocument();
});

test('renders split button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/dividir texto/i);
  expect(buttonElement).toBeInTheDocument();
});
