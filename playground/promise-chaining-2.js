require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5d5073b18e8da2075f1518c0')
.then(task => {
    console.log(task)
    return Task.countDocuments({ completed: false })
})
.then(count => {
    console.log('count: ', count)
})

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5d6c02c1225b3b07cd7d7efa')
.then(count => console.log(count))
.catch(e => console.log(error))