const graphql = require('graphql');
const { Product, Artisan } = require('../models');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLFloat,
  GraphQLList,
  GraphQLSchema
} = graphql;

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    artisan: {
      type: ArtisanType,
      resolve(parent, args) {
        return Artisan.findByPk(parent.artisanId);
      }
    }
  })
});

const ArtisanType = new GraphQLObjectType({
  name: 'Artisan',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    bio: { type: GraphQLString },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.findAll({ where: { artisanId: parent.id } });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    product: {
      type: ProductType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Product.findByPk(args.id);
      }
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        return Product.findAll();
      }
    },
    artisan: {
      type: ArtisanType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Artisan.findByPk(args.id);
      }
    },
    artisans: {
      type: new GraphQLList(ArtisanType),
      resolve(parent, args) {
        return Artisan.findAll();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});