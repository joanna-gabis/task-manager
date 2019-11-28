const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { testUserOne, testUserOneId, taskOne, testUserTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .send({
        title: 'Test task'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.title).toBe('Test task')
    expect(task.completed).toBe(false)
})

test('Should get user\'s tasks', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${testUserOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0].title).toBe('Task One')
})

test('Should not delete task of another user', async () => {
    const response = request(app)
    .delete(`task/${taskOne._id}`)
    .set('Authorization', `Bearer ${testUserTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull
})