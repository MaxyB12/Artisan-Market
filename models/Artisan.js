import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Artisan = sequelize.define('Artisan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'artisans',
  timestamps: true
});

// Define the association
Artisan.associate = (models) => {
  Artisan.hasMany(models.Product, {
    foreignKey: 'artisan_id',
    as: 'Products'  // Changed from 'products' to 'Products'
  });
};

export default Artisan;