import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtisanList from './components/ArtisanList';
import Login from "./pages/Login";
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import '@fontsource/cormorant-garamond';
import '@fontsource/amatic-sc';
import ErrorBoundary from './components/ErrorBoundary';

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
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <GlobalStyle />
        <AppWrapper>
          <Header 
            isAuthenticated={isAuthenticated} 
            setIsAuthenticated={setIsAuthenticated} 
          />
          <MainContent>
            <ContentContainer>
              <ErrorBoundary>
                <Routes>
                  <Route 
                    path="/" 
                    element={<HomePage />} 
                  />
                  <Route 
                    path="/register" 
                    element={
                      isAuthenticated ? 
                        <Navigate to="/artisans" replace /> : 
                        <Register setIsAuthenticated={setIsAuthenticated} />
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      isAuthenticated ? 
                        <Navigate to="/artisans" replace /> : 
                        <Login setIsAuthenticated={setIsAuthenticated} />
                    } 
                  />
                  <Route 
                    path="/artisans" 
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <ArtisanList />
                      </ProtectedRoute>
                    } 
                  />
                  {/* Catch all route for 404 */}
                  <Route 
                    path="*" 
                    element={<Navigate to="/" replace />} 
                  />
                </Routes>
              </ErrorBoundary>
            </ContentContainer>
          </MainContent>
          <Footer />
        </AppWrapper>
      </Router>
    </ApolloProvider>
  );
}

export default App;