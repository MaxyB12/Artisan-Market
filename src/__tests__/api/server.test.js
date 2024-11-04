import request from 'supertest';
import { app } from '../../server';

describe('API Endpoints', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  test('GraphQL endpoint is accessible', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
          query TestQuery {
            artisans {
              id
              name
            }
          }
        `
      });
    
    expect(response.status).toBe(200);
  });
});