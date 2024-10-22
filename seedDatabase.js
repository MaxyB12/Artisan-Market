import { Artisan, Product } from './models/index.js';
import sequelize from './config/database.js';

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const artisans = await Artisan.bulkCreate([
    { name: 'Emma Woodworks', bio: 'Crafting beautiful wooden furniture for over 15 years.' },
    { name: 'Sophia\'s Ceramics', bio: 'Creating unique, hand-thrown pottery inspired by nature.' },
    { name: 'Liam\'s Leather Goods', bio: 'Specializing in high-quality, handmade leather accessories.' },
    { name: 'Olivia\'s Textiles', bio: 'Weaving traditional patterns with modern designs in textiles.' },
    { name: 'Noah\'s Metalworks', bio: 'Forging functional art from various metals for home and garden.' }
  ]);

  const products = [
    { name: 'Handcrafted Oak Dining Table', description: 'A sturdy, elegant dining table made from solid oak.', price: 1200, artisanId: 1 },
    { name: 'Walnut Bookshelf', description: 'A beautiful walnut bookshelf with adjustable shelves.', price: 450, artisanId: 1 },
    { name: 'Cherry Wood Rocking Chair', description: 'A comfortable, classic rocking chair made from cherry wood.', price: 350, artisanId: 1 },
    { name: 'Blue Glazed Dinner Set', description: 'A 12-piece dinner set with a stunning blue glaze finish.', price: 180, artisanId: 2 },
    { name: 'Terra Cotta Planter', description: 'Hand-thrown terra cotta planter, perfect for herbs or small plants.', price: 45, artisanId: 2 },
    { name: 'Porcelain Vase', description: 'An elegant, hand-painted porcelain vase.', price: 120, artisanId: 2 },
    { name: 'Handstitched Leather Wallet', description: 'A durable, handstitched leather wallet with multiple card slots.', price: 80, artisanId: 3 },
    { name: 'Vintage-style Leather Satchel', description: 'A spacious, vintage-inspired leather satchel.', price: 220, artisanId: 3 },
    { name: 'Leather Watch Strap', description: 'A high-quality leather watch strap, available in multiple sizes.', price: 40, artisanId: 3 },
    { name: 'Hand-woven Wool Blanket', description: 'A warm, hand-woven blanket made from 100% wool.', price: 150, artisanId: 4 },
    { name: 'Embroidered Linen Tablecloth', description: 'A beautiful linen tablecloth with hand-embroidered details.', price: 95, artisanId: 4 },
    { name: 'Silk Scarf with Hand-painted Design', description: 'A luxurious silk scarf featuring a unique, hand-painted design.', price: 75, artisanId: 4 },
    { name: 'Wrought Iron Garden Gate', description: 'A decorative and functional wrought iron garden gate.', price: 500, artisanId: 5 },
    { name: 'Copper Wind Chimes', description: 'Melodic copper wind chimes with a patina finish.', price: 65, artisanId: 5 },
    { name: 'Stainless Steel Sculpture', description: 'An abstract stainless steel sculpture for modern home decor.', price: 300, artisanId: 5 }
  ];

  await Product.bulkCreate(products);

  console.log('Database seeded successfully!');
};

seedDatabase()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });