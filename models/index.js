const mongoose = require('mongoose')
// The line below is for Async functionality. 
// This will ensure that everything will run in an Asynchronous Manner"
// More information found in the Classroom slack thread. 
mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.user = require('./user.model')
db.role = require('./role.model')

db.Roles = ['users', 'admin']

module.exports = db