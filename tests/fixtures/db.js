const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const testUserOneId = new mongoose.Types.ObjectId()
const testUserOne = {
    _id: testUserOneId,
    name: 'Test user 1',
    email: 'test@user.com',
    password: 'test1!!!',
    tokens: [{
        token: jwt.sign({ _id: testUserOneId }, process.env.JWT_SECRET)
    }]
}

const testUserTwoId = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: testUserTwoId,
    name: 'Test user 2',
    email: 'test2@user.com',
    password: 'test2!!!',
    tokens: [{
        token: jwt.sign({ _id: testUserTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Task One',
    completed: false,
    owner: testUserOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Task Two',
    completed: false,
    owner: testUserTwoId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    title: 'Task Three',
    completed: false,
    owner: testUserOneId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(testUserOne).save()
    await new User(testUserTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    testUserOne,
    testUserOneId,
    taskOne,
    testUserTwo,
    setupDatabase
}