import React, { Component } from "react";
import Axios from "axios";

export default class Login extends Component {
	state = {
		email: "",
		password: "",
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		await Axios.post(
			process.env.REACT_APP_API_URL + "/auth/login",
			{
				email: this.state.email,
				pass: this.state.password,
			},
			{ withCredentials: true }
		)
			.then(() => (window.location.href = "/dashboard"))
			.catch((error) => alert(error));
	};

	handleChange = (event) => {
		this.setState({ ...this.state, [event.target.name]: event.target.value });
	};

	render() {
		return (
			<div className="container">
				<img src="assets/images/logo.png" alt="Logo" width="150" />
				<form method="POST" onSubmit={this.handleSubmit}>
					<h1>Log In</h1>
					<br />
					<br />
					<div className="form-group">
						<label>Email Address</label>
						<input type="email" name="email" className="form-control" placeholder="Enter email" onChange={this.handleChange} required />
					</div>

					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							name="password"
							className="form-control"
							placeholder="Enter password"
							onChange={this.handleChange}
							required
						/>
					</div>
					<br />
					<br />
					<button type="submit" className="btn btn-primary btn-block custom-input">
						Submit
					</button>
					<br />
					<p className="forgot-password text-center">
						Don't have an account? <a href="/signup">Sign Up</a>
					</p>
				</form>
			</div>
		);
	}
}
