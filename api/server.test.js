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



