import request from 'supertest';
import app from '../server.js';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database.js';
import { User, Artisan, Product } from '../models/index.js';
import bcrypt from 'bcryptjs';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

describe('Server Tests', () => {
  beforeAll(async () => {
    // Create test database connection
    await sequelize.authenticate();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    // Clear test database tables
    await sequelize.sync({ force: true });
  });

  describe('Health Check', () => {
    it('should return status ok', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GraphQL Endpoint', () => {
    it('should respond to GraphQL queries', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: '{ __schema { types { name } } }'
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.data).toBeDefined();
      expect(response.body.data.__schema).toBeDefined();
    });

    it('should handle authentication with valid token', async () => {
      const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET);
      
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: '{ __schema { types { name } } }'
        })
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it('should handle requests with invalid token', async () => {
      const response = await request(app)
        .post('/graphql')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          query: '{ __schema { types { name } } }'
        })
        .expect(200);

      expect(response.body.data).toBeDefined();
    });

    it('should handle errors appropriately', async () => {
      const response = await request(app)
        .post('/graphql')
        .send({
          query: '{ invalidQuery }'
        })
        .expect(400);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('Authentication Mutations', () => {
    it('should register a new user', async () => {
      const registerMutation = `
        mutation {
          register(
            username: "testuser",
            email: "test@example.com",
            password: "password123"
          ) {
            token
            user {
              username
              email
            }
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query: registerMutation })
        .expect(200);

      expect(response.body.data.register.token).toBeDefined();
      expect(response.body.data.register.user.username).toBe('testuser');
    });

    it('should login an existing user', async () => {
      // First create a user
      await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10)
      });

      const loginMutation = `
        mutation {
          login(
            username: "testuser",
            password: "password123"
          ) {
            token
            user {
              username
            }
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query: loginMutation })
        .expect(200);

      expect(response.body.data.login.token).toBeDefined();
    });
  });

  describe('Artisan Queries and Mutations', () => {
    let authToken;
    
    beforeEach(async () => {
      // Create a test user and get auth token
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10)
      });
      authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    });

    it('should create a new artisan', async () => {
      const addArtisanMutation = `
        mutation {
          addArtisan(
            name: "Test Artisan",
            bio: "Test Bio"
          ) {
            id
            name
            bio
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: addArtisanMutation })
        .expect(200);

      expect(response.body.data.addArtisan.name).toBe('Test Artisan');
    });

    it('should query all artisans', async () => {
      // Create test artisan
      await Artisan.create({
        name: 'Test Artisan',
        bio: 'Test Bio'
      });

      const artisansQuery = `
        query {
          artisans {
            id
            name
            bio
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .send({ query: artisansQuery })
        .expect(200);

      expect(response.body.data.artisans).toHaveLength(1);
      expect(response.body.data.artisans[0].name).toBe('Test Artisan');
    });
  });

  describe('Product Queries and Mutations', () => {
    let authToken;
    let testArtisan;

    beforeEach(async () => {
      // Create test user and artisan
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: await bcrypt.hash('password123', 10)
      });
      authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      
      testArtisan = await Artisan.create({
        name: 'Test Artisan',
        bio: 'Test Bio'
      });
    });

    it('should create a new product', async () => {
      const addProductMutation = `
        mutation {
          addProduct(
            name: "Test Product",
            description: "Test Description",
            price: 99.99,
            artisanId: "${testArtisan.id}"
          ) {
            id
            name
            price
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: addProductMutation })
        .expect(200);

      expect(response.body.data.addProduct.name).toBe('Test Product');
    });

    it('should like a product', async () => {
      // Create test product
      const product = await Product.create({
        name: 'Test Product',
        price: 99.99,
        artisan_id: testArtisan.id
      });

      const likeProductMutation = `
        mutation {
          likeProduct(id: "${product.id}") {
            id
            likes
          }
        }
      `;

      const response = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: likeProductMutation })
        .expect(200);

      expect(response.body.data.likeProduct.likes).toBe(1);
    });
  });
}); 