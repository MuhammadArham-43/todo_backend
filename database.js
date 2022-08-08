const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
    mongoose.connect(MONGO_URI)
        .then( () => console.log("Connected to DB."))
        .catch ( e => console.log("Error Connecting to DB: ", e))
}