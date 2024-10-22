import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';
import { Product, Artisan } from '../models/index.js';

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    likes: { type: GraphQLInt },
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addArtisan: {
      type: ArtisanType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        bio: { type: GraphQLString }
      },
      resolve(parent, args) {
        return Artisan.create(args);
      }
    },
    addProduct: {
      type: ProductType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        artisanId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return Product.create({ ...args, likes: 0 });
      }
    },
    likeProduct: {
      type: ProductType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args) {
        const product = await Product.findByPk(args.id);
        if (!product) {
          throw new Error('Product not found');
        }
        product.likes = (product.likes || 0) + 1;
        return product.save();
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

export default schema;