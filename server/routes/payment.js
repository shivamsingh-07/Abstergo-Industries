const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const sendMail = require("../utils/mailConfig");

router.post("/checkout", async (req, res) => {
	const { name, email, amt, custID } = req.body;

	const paymentIntent = await stripe.paymentIntents.create({
		amount: amt,
		currency: "inr",
		description: "Donation",
		customer: custID,
	});

	await sendMail(email, "Donation Reciept", "Dear " + name + ",\n\nYour Donation is highly appreaciated :)\n\nRegards,\nAbstergo Industries Team");

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

router.post("/subscription", async (req, res) => {
	const { name, email, paymentMethodID, custID, priceID } = req.body;

	try {
		await stripe.paymentMethods.attach(paymentMethodID, {
			customer: custID,
		});

		await stripe.customers.update(custID, {
			invoice_settings: {
				default_payment_method: paymentMethodID,
			},
		});

		const subscription = await stripe.subscriptions.create({
			customer: custID,
			items: [{ price: priceID }],
		});

		await sendMail(
			email,
			"Donation Reciept",
			"Dear " + name + ",\n\nYour Donation is highly appreaciated :)\n\nRegards,\nAbstergo Industries Team"
		);

		res.status(200).send(subscription);
	} catch (error) {
		return res.status(402).send({ error: { message: error.message } });
	}
});

router.post("/portal-session", async (req, res) => {
	const { custID } = req.body;
	const session = await stripe.billingPortal.sessions.create({
		customer: custID,
		return_url: process.env.HOST_URL + "/account",
	});

	res.status(200).send(session);
});

module.exports = router;
