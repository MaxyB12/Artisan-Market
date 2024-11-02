import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import schema from './schema/schema.js';
import sequelize from './config/database.js';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Authentication middleware
const getUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId };
  } catch (err) {
    return null;
  }
};

// GraphQL endpoint
app.use('/graphql', async (req, res) => {
  const user = await getUser(req);
  
  return graphqlHTTP({
    schema,
    graphiql: true,
    context: { 
      user,
      req,
      res
    },
    customFormatErrorFn: (error) => {
      console.log('GraphQL Error:', error);
      
      return {
        message: error.message,
        locations: error.locations,
        stack: process.env.NODE_ENV === 'development' ? error.stack?.split('\n') : null,
        path: error.path,
      };
    }
  })(req, res);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

// Database connection and server startup
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`GraphiQL interface: http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database or synchronize:');
    console.error(err.message);
    if (err.parent) {
      console.error('Detailed error:', err.parent.message);
    }
    process.exit(1);
  });

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

export default app;