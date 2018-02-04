import { graphql } from 'graphql';

import schema from '../schema';
import { setupTest } from '../../test/helper';

// beforeEach(async () => await setupTest());
beforeAll(async () => await setupTest());

var createData = null;

it('Create blog', async () => {
  //language=GraphQL
  const query = `
    mutation {
      createBlog(
        input: {
          name: "test",
          content: "test"
        }
      )
      {
        id, name, content
      }
    }
  `;

  const rootValue = {};
  const context = {};

  createData = await graphql(schema, query, rootValue, context);
  console.log('Create blog result: ', createData);

  expect(createData.errors).toBe(undefined);
  expect(createData.data.createBlog).not.toBe(null);
  expect(typeof createData.data.createBlog.id).toBe('string');
  expect(createData.data.createBlog.name).toBe('test');
  expect(createData.data.createBlog.content).toBe('test');
});

it('Get blogs', async () => {
  //language=GraphQL
  const query = `
    query {
      blogs {
        id, name, content, createdBy, updatedBy, createdOn, updatedOn
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Get blogs result: ', result.data.blogs);

  expect(result.errors).toBe(undefined);
  expect(result.data.blogs).not.toBe(null);
  expect(Array.isArray(result.data.blogs)).toBe(true);
  expect(typeof result.data.blogs[0].id).toBe('string');
  expect(result.data.blogs[0].name).toBe('test');
  expect(result.data.blogs[0].content).toBe('test');
  expect(typeof result.data.blogs[0].createdOn).toBe('string');
  expect(result.data.blogs[0].updatedOn).toBe(null);
});

it('Update blog', async () => {
  //language=GraphQL
  const query = `
    mutation {
      updateBlog(
        input: {
          id: "${createData.data.createBlog.id}",
          name: "test2",
          content: "test2"
        }
      )
      {
        id, name, content, createdBy, updatedBy, createdOn, updatedOn
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Update blog result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.updateBlog).not.toBe(null);
  expect(typeof result.data.updateBlog.id).toBe('string');
  expect(typeof result.data.updateBlog.id).toBe('string');
  expect(result.data.updateBlog.name).toBe('test2');
  expect(result.data.updateBlog.content).toBe('test2');
  expect(typeof result.data.updateBlog.createdOn).toBe('string');
  expect(typeof result.data.updateBlog.updatedOn).toBe('string');
});

it('Get blog', async () => {
  //language=GraphQL
  const query = `
    query {
      blog(
        input: {
          id: "${createData.data.createBlog.id}"
        }
      )
      {
        id, name, content, createdBy, updatedBy, createdOn, updatedOn
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Get blog result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.blog).not.toBe(null);
  expect(typeof result.data.blog.id).toBe('string');
  expect(typeof result.data.blog.id).toBe('string');
  expect(result.data.blog.name).toBe('test2');
  expect(result.data.blog.content).toBe('test2');
  expect(typeof result.data.blog.createdOn).toBe('string');
  expect(typeof result.data.blog.updatedOn).toBe('string');
});

it('removeBlog blog', async () => {
  //language=GraphQL
  const query = `
    mutation {
      removeBlog(
        input: {
          id: "${createData.data.createBlog.id}"
        }
      )
      {
        status
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Remove blog result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.removeBlog).not.toBe(null);
  expect(result.data.removeBlog.status).toBe('Ok');
});
