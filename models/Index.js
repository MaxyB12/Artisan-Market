const Artisan = require('./Artisan');
const Product = require('./Product');

Artisan.hasMany(Product);
Product.belongsTo(Artisan);

module.exports = {
  Artisan,
  Product
};