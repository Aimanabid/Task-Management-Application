const mongoose = require ('mongoose')

const taskSchema = new mongoose.Schema({
    title :  String,
    message : String,
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'registrations'},
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
})

module.exports = mongoose.model('tasks',taskSchema)