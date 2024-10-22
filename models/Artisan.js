import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Artisan = sequelize.define('Artisan', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT
  }
});

export default Artisan;