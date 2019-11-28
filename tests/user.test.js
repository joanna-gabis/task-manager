const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { testUserOne, testUserOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Asia',
        email: 'asia@example.pl',
        password: '123newpass!!'
    }).expect(201)

    // check if the database was updated correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull
    expect(user.password).not.toBe('123newpass!!')

    // check if user in response has correct structure
    expect(response.body).toMatchObject({
        user: {
            name: 'Asia',
        },
        token: user.tokens[0].token
    })
})

test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: testUserOne.email,
        password: testUserOne.password
    }).expect(200)

    // check if new token was added to the database
    const user = await User.findById(testUserOne._id)
    expect(response.body.token).toBe(user.tokens[1].token)

})

test('Should not log in nonexistent user', async () => {
    await request(app)
    .post('/users/login')
    .send({
        email: 'test2@shouldfail.com',
        password: 'testtest12@'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user profile without authentication', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete user account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(testUserOne._id)
    expect(user).toBeNull
})

test('Should not delete user account without authentication', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user = await User.findById(testUserOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .send({
        name: 'Jadwiga'
    })
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .expect(200)

    const user = await User.findById(testUserOneId)
    expect(user.name).toBe('Jadwiga')

})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            location: 'Germany'
        })
        .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
        .expect(400)

})