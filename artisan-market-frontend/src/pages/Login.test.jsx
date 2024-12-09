import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login, { LOGIN_MUTATION } from './Login';
import '@testing-library/jest-dom';

// Mock window.location
const mockLocation = {
  href: window.location.href,
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock localStorage
const mockLocalStorage = {
  storage: {},
  getItem: function(key) {
    return this.storage[key] || null;
  },
  setItem: function(key, value) {
    this.storage[key] = value;
  },
  clear: function() {
    this.storage = {};
  }
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('Login Component', () => {
  const mocks = [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: {
          username: 'testuser',
          password: 'testpass'
        }
      },
      result: {
        data: {
          login: {
            token: 'fake-token',
            user: {
              id: '1',
              username: 'testuser',
              email: 'test@example.com'
            }
          }
        }
      }
    }
  ];

  const errorMock = [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: {
          username: 'wronguser',
          password: 'wrongpass'
        }
      },
      error: new Error('Invalid credentials')
    }
  ];

  const renderLogin = (customMocks = mocks) => {
    return render(
      <BrowserRouter>
        <MockedProvider mocks={customMocks} addTypename={false}>
          <Login />
        </MockedProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    window.localStorage.clear();
    window.location.href = '';
  });

  it('renders login form elements', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign In');

    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpass');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(window.localStorage.getItem('token')).toBe('fake-token');
      expect(window.location.href).toBe('/artisans');
    });
  });

  it('handles login error', async () => {
    renderLogin(errorMock);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Sign In');

    await userEvent.type(usernameInput, 'wronguser');
    await userEvent.type(passwordInput, 'wrongpass');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});