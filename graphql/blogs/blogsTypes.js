import {
  GraphQLString,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

const BlogType = new GraphQLObjectType({
  name: 'BlogType',
  description: 'Blog type definition',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdBy: {
      type: GraphQLString,
    },
    updatedBy: {
      type: GraphQLString,
    },
    createdOn: {
      type: GraphQLString,
    },
    updatedOn: {
      type: GraphQLString,
    }
  }),
});

const BlogInputType = new GraphQLInputObjectType({
  name: 'BlogInputType',
  description: 'Blog payload definition',
  fields: () => ({
    id: {
      type: GraphQLString,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});

const BlogRemoveType = new GraphQLObjectType({
  name: 'BlogRemoveType',
  description: 'Blog type definition',
  fields: () => ({
    status: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});

const BlogRemoveInput = new GraphQLInputObjectType({
  name: 'BlogRemoveInput',
  description: 'Blog payload definition',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
    }
  }),
});

export {
  BlogType,
  BlogInputType,
  BlogRemoveType,
  BlogRemoveInput
};
