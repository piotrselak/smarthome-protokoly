const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    password: { type: String },
    room: {type: String },
    admin: {type: Boolean},
    token: { type: String },
});

module.exports = mongoose.model("user", userSchema);