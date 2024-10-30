import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const RegisterWrapper = styled.div`
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

const LoginLink = styled(Link)`
  margin-top: 1rem;
  color: #d4a373;
  text-decoration: none;
  font-size: 1rem;

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

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [register, { error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      navigate('/artisans');
      window.location.reload();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        variables: { username, email, password },
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <RegisterWrapper>
      <Title>Create Account</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FaUser />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <FaEnvelope />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <FaLock />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputGroup>
        <Button type="submit">Sign Up</Button>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
      </Form>
      <LoginLink to="/login">Already have an account? Sign in</LoginLink>
    </RegisterWrapper>
  );
}

export default Register;