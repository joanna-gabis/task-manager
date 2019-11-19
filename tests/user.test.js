const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const testUserOne = {
    name: 'Test user 1',
    email: 'test@user.com',
    password: 'test1!!!'
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(testUserOne).save()
})


test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Asia',
        email: 'asia@example.pl',
        password: '123newpass!!'
    }).expect(201)
})

test('Should log in existing user', async () => {
    await request(app).post('/users/login').send({
        email: testUserOne.email,
        password: testUserOne.password
    }).expect(200)
})

test('Should not log in nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'test2@shouldfail.com',
        password: 'testtest12@'
    }).expect(400)
})