const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema({
	user: String,
	token: String,
	created_on: { type: String, default: new Date() },
});

module.exports = mongoose.model("resets", resetSchema);
