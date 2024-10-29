const mongoose = require ('mongoose')

const taskSchema = new mongoose.Schema({
    title :  String,
    message : String,
})

module.exports = mongoose.model('tasks',taskSchema)