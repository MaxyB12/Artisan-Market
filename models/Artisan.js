const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Artisan = sequelize.define('Artisan', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  }
});

module.exports = Artisan;