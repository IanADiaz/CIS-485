const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database');
const sinon = require('sinon');
//const userRoutes = require('../src/routes/users');
const { routes: userRoutes } = require('../src/routes/users');
const { faker } = require('@faker-js/faker');

describe('Users API', () => {
    afterAll(async () => {
    await db.query('DELETE FROM users');
    });

    it('should create a new user', async () => {
    const newUser = { name: faker.person.fullName(), email: faker.internet.email() };
    const response = await request(app).post('/users').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    });

    it('should fetch all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    });
});


describe('Mocked Database Calls', () => {
    afterEach(() => {
    sinon.restore();
    });

    it('should mock database query for fetching users', async () => {
    const mockData = [{ id: 1, name: 'Test User', email: 'test@example.com' }];
    sinon.stub(db, 'query').resolves({ rows: mockData });
    const req = {};
    const res = {
    json: sinon.spy(),
    };
    
    await userRoutes[0].handler(req, res); // Assuming you export handlers separately
    sinon.assert.calledWith(res.json, mockData);
    });
});

