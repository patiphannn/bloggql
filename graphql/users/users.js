import {
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import isEmail from 'validator/lib/isEmail';

import {
  signToken,
  verifyJWT
} from '../../services/auth';

import {
  UserType,
  UserInputType,
  UserUpdateType
} from './usersTypes';

import passport from 'passport';
import User from '../../models/user';

const userQueries = {
  users: {
    type: new GraphQLList(UserType),
    resolve: async (rootValue, {}, req) => {
      // check token
      let user = await verifyJWT(req.headers.authorization || '');

      return User.find({});
    },
  },
  login: {
    type: UserType,
    args: {
      input: {
        type: new GraphQLNonNull(UserInputType),
      },
    },
    resolve: async (rootValue, { input }) => {
      if (input.username &&
        input.password) {
        const result = await new Promise((resolve, reject) => {
          passport.authenticate('local', (err, user, info) => {
            let error = err || info;
            if(error) {
              reject(error);
              return;
            }
            if(!user) {
              reject({message: 'Something went wrong, please try again.'});
              return;
            }

            user.token = signToken(user);
            resolve(user);
          })({ body: input });
        });
        return result;
      }
    },
  }
};

const userMutations = {
  createUser: {
    type: UserType,
    args: {
      input: {
        type: new GraphQLNonNull(UserInputType),
      },
    },
    resolve: async (rootValue, { input }) => {
      if (input.email &&
        input.username &&
        input.password &&
        input.confirm &&
        input.password === input.confirm) {

        if (!isEmail(input.email)) {
          throw new Error('Email is not in valid format');
        }

        var userData = {
          email: input.email,
          username: input.username,
          password: input.password
        }

        //use schema.create to insert data into the db
        return User.create(userData);
      }
    },
  },
  updateUser: {
    type: UserType,
    args: {
      input: {
        type: new GraphQLNonNull(UserUpdateType),
      },
    },
    resolve: async (rootValue, { input }, req) => {
      // check token
      let user = await verifyJWT(req.headers.authorization || '');

      if (!isEmail(input.email)) {
        throw new Error('Email is not in valid format');
      }

      return User.findOneAndUpdate({
          _id: user._id
        },
        input,
        { new: true }
      );
    },
  }
};

export {
  userQueries,
  userMutations,
};
