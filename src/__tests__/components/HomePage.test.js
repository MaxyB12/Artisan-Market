import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from '../../components/HomePage';

describe('HomePage Component', () => {
  test('renders welcome message', () => {
    render(
      <MockedProvider>
        <HomePage />
      </MockedProvider>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});