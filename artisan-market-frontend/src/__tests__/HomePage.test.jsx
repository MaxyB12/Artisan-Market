import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from './HomePage';

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
  value: mockLocalStorage
});

describe('HomePage Component', () => {
  // Helper function to render HomePage with Router
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders the welcome message for logged out users', () => {
      renderHomePage();
      expect(screen.getByText('Welcome to the Artisan Market')).toBeInTheDocument();
    });

    it('renders the welcome message for logged in users', () => {
      window.localStorage.setItem('token', 'fake-token');
      renderHomePage();
      expect(screen.getByText('Welcome Back to Artisan Market')).toBeInTheDocument();
    });

    it('renders all feature sections', () => {
      renderHomePage();
      expect(screen.getByText('Eco-Friendly')).toBeInTheDocument();
      expect(screen.getByText('Unique Designs')).toBeInTheDocument();
      expect(screen.getByText('Support Artisans')).toBeInTheDocument();
    });

    it('renders the main description', () => {
      renderHomePage();
      expect(screen.getByText(/Discover unique handcrafted goods/)).toBeInTheDocument();
    });
  });

  describe('Authentication State', () => {
    it('shows create account button when logged out', () => {
      renderHomePage();
      expect(screen.getByText(/Create Account/)).toBeInTheDocument();
    });

    it('hides create account button when logged in', () => {
      window.localStorage.setItem('token', 'fake-token');
      renderHomePage();
      expect(screen.queryByText(/Create Account/)).not.toBeInTheDocument();
    });

    it('explore button links to login when logged out', () => {
      renderHomePage();
      const exploreButton = screen.getByText('Explore Artisans');
      expect(exploreButton.closest('a')).toHaveAttribute('href', '/login');
    });

    it('explore button links to artisans when logged in', () => {
      window.localStorage.setItem('token', 'fake-token');
      renderHomePage();
      const exploreButton = screen.getByText('Explore Artisans');
      expect(exploreButton.closest('a')).toHaveAttribute('href', '/artisans');
    });
  });

  describe('Icons and Decorative Elements', () => {
    it('renders decorative icons', () => {
      renderHomePage();
      const icons = document.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Feature Section', () => {
    it('renders all feature descriptions', () => {
      renderHomePage();
      expect(screen.getByText(/Sustainably sourced materials/)).toBeInTheDocument();
      expect(screen.getByText(/One-of-a-kind creations/)).toBeInTheDocument();
      expect(screen.getByText(/Your purchase directly supports/)).toBeInTheDocument();
    });
  });
});