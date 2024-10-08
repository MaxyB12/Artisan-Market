import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaLeaf, FaPaintBrush, FaHeart } from 'react-icons/fa';

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const WelcomeMessage = styled.h2`
  font-size: 3rem;
  color: #2c1810;
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background-color: #d4a373;
  }
`;

const Decoration = styled.div`
  font-size: 2rem;
  color: #d4a373;
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ExploreButton = styled(Link)`
  display: inline-block;
  background-color: #d4a373;
  color: #2c1810;
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.2rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    background-color: #2c1810;
    color: #f7f1e5;
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const FeatureSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 4rem;
  flex-wrap: wrap;
`;

const Feature = styled.div`
  text-align: center;
  max-width: 250px;
  margin: 1rem;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #d4a373;
  margin-bottom: 1rem;
`;

function HomePage() {
  return (
    <HomeWrapper>
      <WelcomeMessage>Welcome to the Artisan Market</WelcomeMessage>
      <Decoration>
        <FaLeaf />
        <FaPaintBrush />
        <FaHeart />
      </Decoration>
      <p>Discover unique handcrafted goods from talented artisans around the world.</p>
      <ExploreButton to="/artisans">Explore Artisans</ExploreButton>
      <FeatureSection>
        <Feature>
          <FeatureIcon><FaLeaf /></FeatureIcon>
          <h3>Eco-Friendly</h3>
          <p>Sustainably sourced materials and eco-conscious artisans.</p>
        </Feature>
        <Feature>
          <FeatureIcon><FaPaintBrush /></FeatureIcon>
          <h3>Unique Designs</h3>
          <p>One-of-a-kind creations you won't find anywhere else.</p>
        </Feature>
        <Feature>
          <FeatureIcon><FaHeart /></FeatureIcon>
          <h3>Support Artisans</h3>
          <p>Your purchase directly supports independent craftspeople.</p>
        </Feature>
      </FeatureSection>
    </HomeWrapper>
  );
}

export default HomePage;