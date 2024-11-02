import Artisan from './Artisan.js';
import Product from './Product.js';
import User from './User.js';

// Artisan-Product relationships
Artisan.hasMany(Product, { foreignKey: 'artisanId' });
Product.belongsTo(Artisan, { foreignKey: 'artisanId' });

// User-Product relationships for likes
User.belongsToMany(Product, { 
  through: 'user_likes',
  as: 'likedProducts',
  foreignKey: 'userId'
});

Product.belongsToMany(User, {
  through: 'user_likes',
  as: 'likedBy',
  foreignKey: 'productId'
});

export { Artisan, Product, User };