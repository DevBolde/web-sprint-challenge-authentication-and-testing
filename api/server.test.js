const request = require('supertest');
const server = require('.././api/server'); // Replace with your server file path
const db = require('../data/dbConfig'); // Replace with your db config file path

describe('register endpoint', () => {
  beforeAll(async () => {
    await db.migrate.latest() // If using knex, migrate to latest db state
  });

  afterAll(async () => {
    await db.migrate.rollback() // Rollback to initial db state after tests are done
  });

  it('should create a new user', async () => {
    const res = await request(server)
      .post('/api/auth/register') // Replace with your register endpoint path
      .send({ username: 'testuser', password: 'testpass' }); // Replace with your user schema

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('testuser');
  });

  it('should return error when username already exists', async () => {
    const res = await request(server)
      .post('/api/auth/register') // Replace with your register endpoint path
      .send({ username: 'testuser', password: 'testpass' }); // Replace with your user schema

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ message: 'username taken' }); // Replace with your error message
  });
});


describe('login endpoint', () => {
  beforeAll(async () => {
    await db.migrate.latest() // If using knex, migrate to latest db state
  });

  afterAll(async () => {
    await db.migrate.rollback() // Rollback to initial db state after tests are done
  });

  it('should log in with correct credentials', async () => {
    // Register a new user
    await request(server)
      .post('/api/auth/register') // Replace with your register endpoint path
      .send({ username: 'testuser', password: 'testpass' }); // Replace with your user schema

    // Attempt to log in with the new user
    const res = await request(server)
      .post('/api/auth/login') // Replace with your login endpoint path
      .send({ username: 'testuser', password: 'testpass' }); // Replace with your user schema

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('welcome, testuser');
    expect(res.body).toHaveProperty('token');
  });

  it('should not log in with incorrect password', async () => {
    const res = await request(server)
      .post('/api/auth/login') // Replace with your login endpoint path
      .send({ username: 'testuser', password: 'wrongpass' }); // Replace with your user schema

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual({ message: 'invalid credentials' }); // Replace with your error message
  });
});
