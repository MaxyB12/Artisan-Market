const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
require('dotenv').config();

const schema = require('./schema/schema');
const sequelize = require('./config/database');

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const PORT = process.env.PORT || 5001;

sequelize.sync({ force: false }) // Set to true to drop and recreate tables on every server start
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Unable to connect to the database:', err));