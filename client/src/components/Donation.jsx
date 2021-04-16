import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Axios from "axios";

export default function Donation(props) {
	const [sub, setSub] = useState(false);
	const [amt, setAmt] = useState(0);
	const [name, setName] = useState("");
	const [issuer, setIssuer] = useState("");
	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [disabled, setDisabled] = useState(true);

	const elements = useElements();
	const stripe = useStripe();

	const handlePayment = async (e) => {
		e.preventDefault();
		if (parseInt(amt) < 500) return setError("Please select an amount.");

		// Call your backend to create the Checkout Session
		const response = await Axios.post(
			process.env.REACT_APP_API_URL + "/pay/checkout",
			{ name: props.auth.name, email: props.auth.email, amt: amt, custID: props.auth.custId },
			{ withCredentials: true }
		);

		setProcessing(true);

		const payload = await stripe.confirmCardPayment(response.data.clientSecret, {
			receipt_email: props.auth.email,
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: name,
					email: props.auth.email,
				},
			},
		});

		if (payload.error) {
			setProcessing(false);
			setError(`Payment failed ${payload.error.message}`);
		} else {
			setError(null);
			setProcessing(false);
			setSucceeded(true);
			alert("Payment Successful :)");
			window.location.href = "/dashboard";
		}
	};

	const handleSubscription = async (e) => {
		e.preventDefault();
		if (parseInt(amt) < 500) return setError("Please select a valid subscription amount.");

		const subID = {
			500: "price_1ICrOIEMykTet131Ol13oZIG",
			2000: "price_1ICrOeEMykTet131qOtqjbyv",
			5000: "price_1ICrOpEMykTet131WQSeovow",
			10000: "price_1ICrOwEMykTet131Q0meQZCB",
		};

		const result = await stripe.createPaymentMethod({
			type: "card",
			card: elements.getElement(CardElement),
			billing_details: {
				name: name,
				email: props.auth.email,
			},
		});

		if (result.error) setError(result.error.message);
		else {
			const response = await Axios.post(
				process.env.REACT_APP_API_URL + "/pay/subscription",
				{
					name: props.auth.name,
					email: props.auth.email,
					paymentMethodID: result.paymentMethod.id,
					custID: props.auth.custId,
					priceID: subID[amt],
				},
				{ withCredentials: true }
			);

			if (response.error) {
				setProcessing(false);
			} else {
				setError(null);
				setProcessing(false);
				setSucceeded(true);
				alert("Payment Successful :)");
				window.location.href = "/dashboard";
			}
		}
	};

	const handleCardChange = async (event) => {
		setIssuer(event.brand);
		setDisabled(event.empty);
		setError(event.error ? event.error.message : "");
	};

	return (
		<div className="container">
			<NavBar />
			<h1>Donation</h1>
			<br />
			<br />
			<Form.Check type="switch" id="custom-switch" label="Create Subscription" custom onChange={(e) => setSub(e.target.checked)} />
			<br />
			<Form.Control
				as="select"
				className="custom-input"
				name="amt"
				onChange={(event) => setAmt(event.target.value)}
				defaultValue="0"
				custom
				required
			>
				<option value="0" disabled>
					Select that best suits you...
				</option>
				<option value={500}>₹5{sub ? " /month" : ""}</option>
				<option value={2000}>₹20{sub ? " /month" : ""}</option>
				<option value={5000}>₹50{sub ? " /month" : ""}</option>
				<option value={10000}>₹100{sub ? " /month" : ""}</option>
			</Form.Control>
			<br />
			<br />
			<br />
			<Cards expiry="" name={name} number="" cvc="" preview={true} issuer={issuer} />
			<br />

			<form id="payment-form" method="POST" onSubmit={sub ? handleSubscription : handlePayment}>
				<CardElement
					id="card-element"
					options={{
						style: {
							base: {
								color: "#32325d",
								fontFamily: "Arial, sans-serif",
								fontSmoothing: "antialiased",
								fontSize: "16px",
								"::placeholder": {
									color: "#32325d",
								},
							},
							invalid: {
								color: "#fa755a",
								iconColor: "#fa755a",
							},
						},
					}}
					onChange={handleCardChange}
				/>
				<br />
				<input
					type="text"
					name="name"
					className="form-control"
					placeholder="Name on card"
					onChange={(event) => setName(event.target.value)}
					required
				/>
				<br />
				{error && (
					<Alert variant="danger" style={{ margin: "0 auto" }}>
						{error}
					</Alert>
				)}
				<br />
				<Button variant="success" type="submit" disabled={processing || disabled || succeeded}>
					{processing ? <div className="spinner" id="spinner" /> : "Donate"}
				</Button>
				&nbsp;&nbsp;
				<Button variant="light" href="/dashboard">
					Nah, Sometime Later
				</Button>
				<br />
				<br />
				<small>Your payment is secured by stripe.</small>
			</form>
		</div>
	);
}
