const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true&limit=2&skip=4&sortBy=createdAt:asc
// limit and skip
router.get('/tasks', auth, async (req, res) => {
    let match = {
        ...(req.query.completed && { completed: req.query.completed === 'true' })
    }
    let sort = {}
    if (req.query.sortBy) {
        let sortBy = req.query.sortBy.split(':')
        sort[sortBy[0]] = sortBy[1]
    }
    
    
    try {
        // let tasks = await Task.find({ owner: req.user._id })
        // res.send(tasks)
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    let _id = req.params.id
    try {
        let task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    let allowed = ['title', 'completed']
    let updates = Object.keys(req.body)
    let isValidOperation = updates.every(key => allowed.includes(key))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid operation' })
    }

    try {
        let task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach(update => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        let task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router