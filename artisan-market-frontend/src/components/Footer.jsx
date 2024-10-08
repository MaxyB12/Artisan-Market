import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const FooterWrapper = styled.footer`
  background-color: #d4a373;
  color: #2c1810;
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: repeating-linear-gradient(
      45deg,
      #2c1810,
      #2c1810 10px,
      #d4a373 10px,
      #d4a373 20px
    );
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #2c1810;
  font-size: 1.5rem;
  transition: color 0.3s;

  &:hover {
    color: #f7f1e5;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <p>Made with <FaHeart style={{color: '#e25555'}} /> by Artisan Market</p>
      <p>&copy; 2023 Artisan Market. All rights reserved.</p>
      <SocialLinks>
        <SocialIcon href="#"><FaTwitter /></SocialIcon>
        <SocialIcon href="#"><FaFacebook /></SocialIcon>
        <SocialIcon href="#"><FaInstagram /></SocialIcon>
      </SocialLinks>
    </FooterWrapper>
  );
}

export default Footer;