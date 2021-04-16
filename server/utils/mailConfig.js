const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

module.exports = async (reciever, subject, body) => {
	const token = await oAuth2Client.getAccessToken();

	return new Promise((resolve, reject) => {
		const mailOptions = {
			from: "Abstergo Industries <testingkeylogger171@gmail.com>",
			to: reciever,
			subject: subject,
			text: body,
		};

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: "testingkeylogger171@gmail.com",
				clientId: process.env.CLIENT_ID,
				clientSecret: process.env.CLIENT_SECRET,
				refreshToken: process.env.REFRESH_TOKEN,
				accessToken: token,
			},
		});

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) reject(err);
			resolve(info);
		});
	});
};

// let mail = {
// 	from: "Abstergo Industries <testingkeylogger171@gmail.com>",
// 	to: reciever,
// 	subject: "Account Verification",
// 	html: `Please enter this code: <code>` + OTP + `</code>`,
// };

// const transporter = nodemailer.createTransport({
// 	service: "gmail",
// 	auth: {
// 		type: "OAuth2",
// 		user: "testingkeylogger171@gmail.com",
// 		clientId: process.env.CLIENT_ID,
// 		clientSecret: process.env.CLIENT_SECRET,
// 		refreshToken: process.env.REFRESH_TOKEN,
// 		accessToken: await oAuth2Client.getAccessToken(),
// 	},
// });

// transporter.sendMail(mail, async (err, info) => {
// 	if (err) throw err;

// 	if (!check) {
// await new Verify({
// 	user: reciever,
// 	code: OTP,
// }).save();
// 	}
// 	return info;
// });
// };
