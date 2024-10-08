const { Artisan, Product } = require('./models');
const sequelize = require('./config/database');

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    const artisanCount = await Artisan.count();
    console.log(`Number of artisans: ${artisanCount}`);

    const productCount = await Product.count();
    console.log(`Number of products: ${productCount}`);

    const artisans = await Artisan.findAll({ include: Product });
    artisans.forEach(artisan => {
      console.log(`\nArtisan: ${artisan.name}`);
      console.log(`Products: ${artisan.Products.map(p => p.name).join(', ')}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();