const mongoose = require ('mongoose')

const Role = mongoose.model (
    // "Role", is the declaration of the model name
    "Role",
    new mongoose.Schema ({
        name: String
    })
)  

module.exports = Role