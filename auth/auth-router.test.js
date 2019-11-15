const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

describe('Auth Router', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })
    describe('POST /register endpoint', () => {
        it('should return a 201 http status code', () => {
            const userBody = { username: 'test', password: 'test' } 

            return request(server).post('/api/auth/register').send(userBody)
                .then(res => {
                    expect(res.type).toMatch(/json/i)
                    expect(res.status).toBe(201)
                })
        })
        it('should return an object with a username and hashed password', async () => {
            const res = await request(server).post('/api/auth/register')
                .send({ username: 'maack', password: 'password'})

            expect(res.body.user).toBe('maack')
        })
    })
})