const localStratergy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = (passport) => {
	passport.use(
		"local",
		new localStratergy(
			{
				usernameField: "email",
				passwordField: "pass",
			},
			(email, pass, done) => {
				User.findOne({ email: email }, async (err, user) => {
					if (err) throw err;
					if (!user) return done(null, false);

					await bcrypt.compare(pass, user.password, (err, result) => {
						if (err) throw err;
						if (result) return done(null, user);
						return done(null, false);
					});
				});
			}
		)
	);

	passport.serializeUser((user, cb) => cb(null, user));

	passport.deserializeUser((id, cb) => {
		User.findOne({ _id: id }, (err, user) => cb(null, user));
	});
};
