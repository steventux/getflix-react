import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Getflix title', () => {
  render(<App />);
  const getflixTitle = screen.getByText(/getflix/i);
  expect(getflixTitle).toBeInTheDocument();
});

test('renders search form', () => {
  render(<App />);
  const searchField = screen.getByPlaceholderText(/the shining/i);
  expect(searchField).toBeInTheDocument();

  const searchButton = screen.getByRole('button', { name: /search/i });
  expect(searchButton).toBeInTheDocument();

  const delugeLink = screen.getByRole('link', { name: /deluge/i });
  expect(delugeLink).toBeInTheDocument();
});
