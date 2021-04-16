const mailer = require("./utils/mailConfig.js");

mailer("official.tech1234@gmail.com", "DotENV Test", "Hi from NodeJS")
	.then((res) => console.log(res))
	.catch((err) => console.log(err));
