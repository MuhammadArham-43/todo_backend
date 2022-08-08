const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    userEmail:String,
    task: String,
    status: String,
    dateCreated: Date,
})

module.exports = mongoose.model("Todos", todoSchema);