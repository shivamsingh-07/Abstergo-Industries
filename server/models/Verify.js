const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema({
	user: String,
	code: Number,
	created_on: { type: String, default: new Date(), expires: "1h" },
});

module.exports = mongoose.model("verifications", verifySchema);
