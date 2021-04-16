const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("./utils/authConfig")(passport);
require("dotenv").config();

//----------------------------------------------- Initializing App -------------------------------------------
const app = express();

//----------------------------------------------- MongoDB Connection -----------------------------------------
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () =>
	console.log("Database Connected...")
);

//------------------------------------------------ Middlewares ---------------------------------------------
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.HOST_URL, credentials: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(passport.initialize());
app.use(passport.session());

//-------------------------------------------------- Routes ---------------------------------------------------
app.use("/auth", require("./routes/auth"));
app.use("/pay", require("./routes/payment"));

//---------------------------------------------- Starting Server -----------------------------------------------
const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log("API is live at " + PORT));
