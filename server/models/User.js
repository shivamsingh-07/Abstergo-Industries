const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	avatarUrl: String,
	name: String,
	email: String,
	password: String,
	custId: String,
	created_on: { type: String, default: new Date() },
});

module.exports = mongoose.model("users", userSchema);
