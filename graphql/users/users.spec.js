import { graphql } from 'graphql';

import schema from '../schema';
import { setupTest } from '../../test/helper';

// beforeEach(async () => await setupTest());
beforeAll(async () => await setupTest());

var createData = null;

it('Create user', async () => {
  //language=GraphQL
  const query = `
    mutation {
      createUser(
        input: {
          email: "graphql@test.com",
          username: "test",
          password: "test",
          confirm: "test"
        }
      )
      {
        id, email, username
      }
    }
  `;

  const rootValue = {};
  const context = {};

  createData = await graphql(schema, query, rootValue, context);
  console.log('Create user result: ', createData);

  expect(createData.errors).toBe(undefined);
  expect(createData.data.createUser).not.toBe(null);
  expect(typeof createData.data.createUser.id).toBe('string');
  expect(createData.data.createUser.email).toBe('graphql@test.com');
  expect(createData.data.createUser.username).toBe('test');
  expect(createData.data.createUser.password).toBe(undefined);
});

it('Get users', async () => {
  //language=GraphQL
  const query = `
    query {
      users {
        id, email, username
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Get users result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.users).not.toBe(null);
  expect(Array.isArray(result.data.users)).toBe(true);
  expect(typeof result.data.users[0].id).toBe('string');
  expect(result.data.users[0].email).toBe('graphql@test.com');
  expect(result.data.users[0].username).toBe('test');
  expect(result.data.users[0].password).toBe(undefined);
});

it('Login user', async () => {
  //language=GraphQL
  const query = `
    query {
      login(
        input: {
          username: "test",
          password: "test"
        }
      )
      {
        id, email, username, token
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Login users result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.login).not.toBe(null);
  expect(typeof result.data.login.id).toBe('string');
  expect(result.data.login.email).toBe('graphql@test.com');
  expect(result.data.login.username).toBe('test');
  expect(result.data.login.password).toBe(undefined);
  expect(typeof result.data.login.token).toBe('string');
});

it('Update user', async () => {
  //language=GraphQL
  const query = `
    mutation {
      updateUser(
        input: {
          email: "graphql@test.com",
          username: "test2",
          password: "test2"
        }
      )
      {
        id, email, username
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Update users result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.updateUser).not.toBe(null);
  expect(typeof result.data.updateUser.id).toBe('string');
  expect(result.data.updateUser.email).toBe('graphql@test.com');
  expect(result.data.updateUser.username).toBe('test2');
  expect(result.data.updateUser.password).toBe(undefined);
});

it('Login user after update', async () => {
  //language=GraphQL
  const query = `
    query {
      login(
        input: {
          username: "test2",
          password: "test2"
        }
      )
      {
        id, email, username, token
      }
    }
  `;

  const rootValue = {};
  const context = {};

  const result = await graphql(schema, query, rootValue, context);
  console.log('Login users after update result: ', result);

  expect(result.errors).toBe(undefined);
  expect(result.data.login).not.toBe(null);
  expect(typeof result.data.login.id).toBe('string');
  expect(result.data.login.email).toBe('graphql@test.com');
  expect(result.data.login.username).toBe('test2');
  expect(result.data.login.password).toBe(undefined);
  expect(typeof result.data.login.token).toBe('string');
});
