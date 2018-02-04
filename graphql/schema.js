import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';

import {
  userQueries,
  userMutations,
} from './users/users';

import {
  blogQueries,
  blogMutations,
} from './blogs/blogs';


export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      ...userQueries,
      ...blogQueries,
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
      ...userMutations,
      ...blogMutations,
    }),
  }),
});
