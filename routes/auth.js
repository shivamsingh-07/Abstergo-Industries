const router = require("express").Router();
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const User = require("../models/User");
const Verify = require("../models/Verify");
const Reset = require("../models/ResetPassword");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/mailConfig");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const upload = multer({ storage: multer.diskStorage({}) });

// Configuring Cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// User Route
router.post("/", (req, res) => {
	if (req.isAuthenticated()) return res.status(200).send(req.user);
	res.end();
});

// Retrieve Users Route
router.post("/users", (req, res) => {
	User.findOne({ custId: req.body.custID }, (err, result) => {
		if (err) throw err;
		res.send(result);
	});
});

// Login Route
router.post("/login", passport.authenticate("local"), (req, res) => {
	if (req.user) return res.status(200).send({ message: "User Authorised!" });
	res.status(401).send({ message: "User Unauthorised!" });
});

// Logout Route
router.post("/logout", (req, res) => {
	req.logout();
	req.session.destroy((err) => {
		if (err) throw err;
		res.status(200).clearCookie("connect.sid", { path: "/" }).send({ message: "User Logged Out Successfully" });
	});
});

// Sign Up Route
router.post("/signup", upload.single("avatar"), async (req, res) => {
	const { name, email, pass, code } = req.body;

	Verify.findOne({ user: email }, async (err, data) => {
		if (err) throw err;
		if (!data) return res.status(401).send({ error: "Unauthorised Action!" });

		if (code == data.code) {
			const customer = await stripe.customers.create({
				email: email,
				name: name,
			});

			await cloudinary.uploader.upload(req.file.path, async (err, avatar) => {
				if (err) throw err;

				await new User({
					name: name,
					email: email,
					password: await bcrypt.hash(pass, 10),
					avatarUrl: avatar.secure_url,
					custId: customer.id,
				})
					.save()
					.then((response) => {
						req.login(response, () => res.status(200).send({ message: "User Registered" }));
					})
					.catch((err) => console.log(err.message));
			});

			await sendMail(
				email,
				"Welcome To Abstergo Industries",
				"Dear " + name + "\n\nThanks for joining us.\n\nRegard,\nAbstergo Industries Team"
			);

			await Verify.deleteOne({ user: email }, (err) => {
				if (err) throw err;
			});
		} else {
			res.status(400).send({ error: "Incorrect OTP!" });
		}
	});
});

// Verify Route
router.post("/verify", async (req, res) => {
	const { email } = req.body;

	await User.findOne({ email: email }, (err, same) => {
		if (err) throw err;
		if (same) return res.send({ error: "User Already Exists!" });
	});

	let OTP = null;

	await Verify.findOne({ user: email }, (err, data) => {
		if (err) throw err;

		if (data) OTP = data.code;
		else {
			OTP = Math.floor(Math.random() * 100000);
		}
	});

	await new Verify({
		user: email,
		code: OTP,
	}).save();

	await sendMail(email, "Account Verification", "Please enter this code: " + OTP).then((info) => res.send(info));
});

module.exports = router;
