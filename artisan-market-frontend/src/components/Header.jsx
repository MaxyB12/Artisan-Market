import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaSignInAlt, FaUserPlus, FaPalette, FaSignOutAlt, FaPencilAlt, FaClipboard } from 'react-icons/fa';

const HeaderWrapper = styled.header`
  background-color: #d4a373;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

const AnimatedTitle = styled.h1`
  color: transparent;
  font-size: 3.5rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  font-family: 'Amatic SC', cursive;
  position: relative;
  display: inline-block;
  -webkit-text-stroke: 1px #2c1810;
  
  &::before {
    content: 'Artisan Market';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: white;
    background: linear-gradient(
      90deg,
      white 0%,
      rgba(255,255,255,0.9) 45%,
      rgba(255,255,255,0.8) 65%,
      transparent 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 200% 100%;
    animation: paint 5s ease-in-out infinite;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.1));
  }

  @keyframes paint {
    0% {
      background-position: -200% 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
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
  font-size: 1.4rem;
  font-family: 'Amatic SC', cursive;
  letter-spacing: 1px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;

  &:hover {
    background-color: rgba(44, 24, 16, 0.1);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const LogoutButton = styled.button`
  color: #2c1810;
  background: none;
  border: none;
  font-size: 1.4rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Amatic SC', cursive;
  letter-spacing: 1px;

  &:hover {
    background-color: rgba(44, 24, 16, 0.1);
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.2rem;
  }
`;

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setIsAuthenticated) {
      setIsAuthenticated(false);
    }
    navigate('/login');
  };

  return (
    <HeaderWrapper>
      <AnimatedTitle>Artisan Market</AnimatedTitle>
      <Nav>
        <NavLink to="/"><FaHome /> Home</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/artisans"><FaPalette /> Artisans</NavLink>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </>
        ) : (
          <>
            <NavLink to="/login"><FaPencilAlt /> Login</NavLink>
            <NavLink to="/register"><FaClipboard /> Register</NavLink>
          </>
        )}
      </Nav>
    </HeaderWrapper>
  );
}

export default Header;