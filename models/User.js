const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    balance: { type: Number, default: 1000 }
});

module.exports = mongoose.model("User", userSchema);