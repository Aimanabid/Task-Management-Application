const mongoose = require ('mongoose')

const taskSchema = new mongoose.Schema({
    title :  String,
    message : String,
<<<<<<< HEAD
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'registrations'},
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null }
=======
    userId : {type : mongoose.Schema.Types.ObjectId, ref : 'Registration'}
>>>>>>> c5e08f40d85544538d87006b203b59cb5ccb3b46
})

module.exports = mongoose.model('tasks',taskSchema)
