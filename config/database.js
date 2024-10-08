const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // set to console.log to see the raw SQL queries
  define: {
    timestamps: true
  }
});

module.exports = sequelize;