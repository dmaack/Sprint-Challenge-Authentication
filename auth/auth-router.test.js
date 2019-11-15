const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
            // try hashed password test at end
        })
    })
    describe('POST /login endpoint', () => {
        it('should return a 200 http status code and successfully login a new user', () => {
            const userBody = { username: 'mango', password: 'puppypassword' } 

            request(server).post('/api/auth/register').send(userBody)
                .then(res => {
                    return request(server).post('/api/auth/login').send(userBody)
                        .then(res => {
                            expect(res.type).toMatch(/json/i)
                            expect(res.status).toBe(200)
                        })
                })
        })
        it('should return an object wiht a Welcome message', async () => {
            const userBody = { username: 'Thomas', password: 'password' }

            await request(server).post('/api/auth/register').send(userBody)

            const res = await request(server).post('/api/auth/login').send(userBody)

            expect(res.body.message).toBe('Welcome Thomas')
        })
    })
})