import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import isEmail from 'validator/lib/isEmail';

import {
  verifyJWT
} from '../../auth/auth.service';

import {
  BlogType,
  BlogInputType,
  BlogRemoveType,
  BlogRemoveInput
} from './blogsTypes';

import Blog from '../../models/blog';

const blogQueries = {
  blogs: {
    type: new GraphQLList(BlogType),
    resolve: async (rootValue, {}, req) => {
      // check token
      await verifyJWT((req.headers && req.headers.authorization) || '');

      return Blog.find({})
        .populate('createdBy', 'id, username')
        .populate('updatedBy', 'id, username');
    },
  },
  blog: {
    type: BlogType,
    args: {
      input: {
        type: new GraphQLNonNull(BlogRemoveInput),
      },
    },
    resolve: async (rootValue, { input }, req) => {
      // check token
      await verifyJWT((req.headers && req.headers.authorization) || '');

      return Blog.findOne({ _id: input.id })
        .populate('createdBy', 'id, username')
        .populate('updatedBy', 'id, username');
    },
  }
};

const blogMutations = {
  createBlog: {
    type: BlogType,
    args: {
      input: {
        type: new GraphQLNonNull(BlogInputType),
      },
    },
    resolve: async (rootValue, { input }, req) => {
      // check token
      let user = await verifyJWT((req.headers && req.headers.authorization) || '');

      if (input.name &&
        input.content) {

        // createdBy
        input.createdBy = (user && user._id) || undefined;

        //use schema.create to insert data into the db
        return Blog.create(input);
      }
    },
  },
  updateBlog: {
    type: BlogType,
    args: {
      input: {
        type: new GraphQLNonNull(BlogInputType),
      },
    },
    resolve: async (rootValue, { input }, req) => {
      // check token
      let user = await verifyJWT((req.headers && req.headers.authorization) || '');

      // updatedBy
      input.updatedBy = (user && user._id) || undefined;

      return Blog.findOneAndUpdate({
          _id: input.id
        },
        input,
        { new: true }
      );
    },
  },
  removeBlog: {
    type: BlogRemoveType,
    args: {
      input: {
        type: new GraphQLNonNull(BlogRemoveInput),
      },
    },
    resolve: async (rootValue, { input }, req) => {
      // check token
      await verifyJWT((req.headers && req.headers.authorization) || '');

      return Blog.remove({
          _id: input.id
        }
      ).then(() => {
        return { status: 'Ok' }
      });
    },
  }
};

export {
  blogQueries,
  blogMutations,
};
