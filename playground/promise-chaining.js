require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5d6c00c667603a0764d17128', { age: 5 })
// .then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 12 })
// })
// .then((result) => {
//     console.log(result)
// })
// .catch(e => console.log(e))

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

updateAgeAndCount('5d6c00c667603a0764d17128', 7)
.then(count => console.log(count))
.catch(e => console.log(e))