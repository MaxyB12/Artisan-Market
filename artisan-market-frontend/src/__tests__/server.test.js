import request from 'supertest';
import app from '../../../server';
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Sequelize
jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn(),
    define: jest.fn(),
    sync: jest.fn(),
  };
  const Sequelize = jest.fn(() => mSequelize);
  Sequelize.DataTypes = {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    DATE: 'DATE',
  };
  return Sequelize;
});

describe('API Endpoints', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('GET /graphql endpoint exists', async () => {
    const response = await request(app).post('/graphql');
    expect(response.status).not.toBe(404);
  });
});