const mongoose = require ('mongoose')

const taskSchema = new mongoose.Schema({
    title :  String,
    message : String,
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'Registration'}
})

module.exports = mongoose.model('tasks',taskSchema)
