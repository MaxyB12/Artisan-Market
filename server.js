import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import dotenv from 'dotenv';
import schema from './schema/schema.js';
import sequelize from './config/database.js';

dotenv.config();

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 5001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
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