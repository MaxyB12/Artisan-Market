import { 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLSchema, 
  GraphQLID, 
  GraphQLList, 
  GraphQLNonNull, 
  GraphQLFloat, 
  GraphQLInt 
} from 'graphql';
import { Product, Artisan, User } from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

// User type for authentication
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

// Auth payload type for registration/login response
const AuthPayloadType = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: () => ({
    token: { type: GraphQLString },
    user: { type: UserType }
  })
});

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    price: { type: GraphQLNonNull(GraphQLFloat) },
    likes: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    artisan_id: { type: GraphQLNonNull(GraphQLID) },
    Artisan: {
      type: ArtisanType,
      resolve: async (parent) => {
        try {
          return await Artisan.findByPk(parent.artisan_id);
        } catch (error) {
          console.error('Error fetching product artisan:', error);
          throw error;
        }
      }
    }
  })
});

const ArtisanType = new GraphQLObjectType({
  name: 'Artisan',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    bio: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    Products: {
      type: new GraphQLList(ProductType),
      resolve: async (parent) => {
        try {
          return await Product.findAll({
            where: { artisan_id: parent.id },
            order: [['createdAt', 'DESC']]
          });
        } catch (error) {
          console.error('Error fetching artisan products:', error);
          throw error;
        }
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Current user query
    me: {
      type: UserType,
      resolve: async (parent, args, context) => {
        try {
          if (!context.userId) {
            throw new Error('Not authenticated');
          }
          const user = await User.findByPk(context.userId);
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        } catch (error) {
          console.error('Error in me query:', error);
          throw error;
        }
      }
    },

    // Single product query
    product: {
      type: ProductType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args, context) => {
        try {
          const product = await Product.findByPk(args.id, {
            include: [{
              model: Artisan,
              as: 'Artisan'  // Changed to match model association
            }]
          });
          if (!product) {
            throw new Error('Product not found');
          }
          return product;
        } catch (error) {
          console.error('Error fetching product:', error);
          throw error;
        }
      }
    },

    // All products query
    products: {
      type: new GraphQLList(ProductType),
      resolve: async (parent, args, context) => {
        try {
          return await Product.findAll({
            include: [{
              model: Artisan,
              as: 'Artisan'  // Changed to match model association
            }],
            order: [['createdAt', 'DESC']]
          });
        } catch (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
      }
    },

    // Single artisan query
    artisan: {
      type: ArtisanType,
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: async (parent, args, context) => {
        try {
          const artisan = await Artisan.findByPk(args.id, {
            include: [{
              model: Product,
              as: 'Products'  // Changed to match model association
            }]
          });
          if (!artisan) {
            throw new Error('Artisan not found');
          }
          return artisan;
        } catch (error) {
          console.error('Error fetching artisan:', error);
          throw error;
        }
      }
    },

    // All artisans query
    artisans: {
      type: new GraphQLList(ArtisanType),
      resolve: async (parent, args, context) => {
        try {
          console.log('Fetching artisans...');
          const artisans = await Artisan.findAll({
            include: [{
              model: Product,
              as: 'Products'
            }],
            order: [['createdAt', 'DESC']]
          });
          console.log(`Found ${artisans.length} artisans`);
          return artisans;
        } catch (error) {
          console.error('Error fetching artisans:', error);
          throw error;
        }
      }
    }
  }
});

// Mutation
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Add register mutation
    register: {
      type: AuthPayloadType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          // Check if user exists
          const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { username: args.username },
                { email: args.email }
              ]
            }
          });

          if (existingUser) {
            throw new Error('User already exists');
          }

          // Hash password
          const passwordHash = await bcrypt.hash(args.password, 10);

          // Create user
          const user = await User.create({
            username: args.username,
            email: args.email,
            password_hash: passwordHash
          });

          // Generate token
          const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
          );

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },

    // Add login mutation
    login: {
      type: AuthPayloadType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args) {
        try {
          const user = await User.findOne({
            where: { username: args.username }
          });

          if (!user) {
            throw new Error('User not found');
          }

          const valid = await bcrypt.compare(args.password, user.password_hash);
          if (!valid) {
            throw new Error('Invalid password');
          }

          const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1d' }
          );

          return {
            token,
            user
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    },

    // Your existing mutations
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