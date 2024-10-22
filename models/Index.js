import Artisan from './Artisan.js';
import Product from './Product.js';

Artisan.hasMany(Product, { foreignKey: 'artisanId' });
Product.belongsTo(Artisan, { foreignKey: 'artisanId' });

export { Artisan, Product };