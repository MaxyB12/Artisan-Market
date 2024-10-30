import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaPalette, FaSignOutAlt } from 'react-icons/fa';

const HeaderWrapper = styled.header`
  background-color: #d4a373;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23f7f1e5" /></svg>');
    background-size: 20px 20px;
    opacity: 0.1;
  }

  &::before {
    top: -100px;
    left: -100px;
    transform: rotate(30deg);
  }

  &::after {
    bottom: -100px;
    right: -100px;
    transform: rotate(-30deg);
  }
`;

const Title = styled.h1`
  color: #2c1810;
  font-size: 3.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const Nav = styled.nav`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: #2c1810;
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;

  &:hover {
    background-color: rgba(255,255,255,0.2);
    transform: translateY(-2px);
  }
`;

// New styled component for auth buttons
const AuthButton = styled(NavLink)`
  background-color: #2c1810;
  color: #f7f1e5;
  padding: 0.5rem 1rem;
  border-radius: 5px;

  &:hover {
    background-color: #3d2415;
    color: #fff;
  }
`;

function Header() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <HeaderWrapper>
      <Title>Artisan Market</Title>
      <Nav>
        <NavLink to="/"><FaHome /> Home</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/artisans"><FaPalette /> Artisans</NavLink>
            <AuthButton as="button" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </AuthButton>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </Nav>
    </HeaderWrapper>
  );
}

export default Header;