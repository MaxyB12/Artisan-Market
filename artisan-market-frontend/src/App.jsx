import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtisanList from './components/ArtisanList';
import Login from "./pages/Login";
import ProtectedRoute from './components/ProtectedRoute'; // Add this import
import '@fontsource/cormorant-garamond';
import '@fontsource/amatic-sc';
import Register from './pages/Register';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Cormorant Garamond', serif;
    background-color: #f7f1e5;
    color: #2c1810;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Amatic SC', cursive;
  }
`;

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  background-color: #f7f1e5;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  box-sizing: border-box;
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <GlobalStyle />
        <AppWrapper>
          <Header />
          <MainContent>
            <ContentContainer>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/artisans" 
                  element={
                    <ProtectedRoute>
                      <ArtisanList />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </ContentContainer>
          </MainContent>
          <Footer />
        </AppWrapper>
      </Router>
    </ApolloProvider>
  );
}

export default App;