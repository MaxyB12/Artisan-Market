import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom'; // Add Link here
import styled from 'styled-components';
import { FaUser, FaLock } from 'react-icons/fa';


const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #2c1810;
  margin-bottom: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: #d4a373;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  width: 100%;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #d4a373;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  padding-left: 3rem;
  border: 2px solid #d4a373;
  border-radius: 5px;
  font-size: 1rem;
  font-family: 'Cormorant Garamond', serif;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #2c1810;
  }

  &::placeholder {
    color: #d4a373;
  }
`;

const Button = styled.button`
  background-color: #d4a373;
  color: #2c1810;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'Cormorant Garamond', serif;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    background-color: #2c1810;
    color: #f7f1e5;
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }
`;

const RegisterLink = styled(Link)`
  margin-top: 1.5rem;
  color: #d4a373;
  text-decoration: none;
  font-size: 1rem;
  display: block;
  text-align: center;

  &:hover {
    color: #2c1810;
  }
`;

const ErrorMessage = styled.p`
  color: #e25555;
  text-align: center;
  margin-top: 1rem;
  font-family: 'Cormorant Garamond', serif;
`;

const Decoration = styled.div`
  font-size: 2rem;
  color: #d4a373;
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [login, { error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.token) {
        localStorage.setItem('token', data.login.token);
        window.location.href = '/artisans';
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({
        variables: { username, password }
      });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <LoginWrapper>
      <Title>Welcome Back</Title>
      <Decoration>
        <FaUser />
      </Decoration>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FaUser />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <FaLock />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
        <Button type="submit">Sign In</Button>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
      </Form>
      <RegisterLink to="/register">Don't have an account? Sign up</RegisterLink>
    </LoginWrapper>
  );
}

export default Login;