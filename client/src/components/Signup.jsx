import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import Axios from "axios";

export default class SignUp extends Component {
	state = {
		name: "",
		email: "",
		pass: "",
		avatar: "",
		file: null,
		code: null,
		show: false,
		valid: true,
		userDB: null,
	};

	handleSubmit = (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("name", this.state.name);
		formData.append("email", this.state.email);
		formData.append("pass", this.state.pass);
		formData.append("code", this.state.code);
		formData.append("avatar", this.state.file);

		Axios.post(process.env.REACT_APP_API_URL + "/auth/signup", formData, {
			withCredentials: true,
			headers: {
				"content-type": "multipart/form-data",
			},
		})
			.then((status) => {
				if (status.data.error) alert(status.data.error);
				else window.location.href = "/dashboard";
			})
			.catch((error) => alert(error.message));
	};

	handleVerify = (event) => {
		event.preventDefault();

		Axios.post(
			process.env.REACT_APP_API_URL + "/auth/verify",
			{
				email: this.state.email,
			},
			{
				withCredentials: true,
			}
		)
			.then((status) => {
				if (status.data.error) {
					alert(status.data.error);
					document.getElementById("validate").classList.add("is-invalid");
				} else this.setState({ ...this.state, show: true });
			})
			.catch((error) => alert(error.message));
	};

	handleChange = (event) => {
		this.setState({ ...this.state, [event.target.name]: event.target.value });
	};

	render() {
		return (
			<div className="container">
				<img src="assets/images/logo.png" alt="Logo" width="150" />
				<form method="POST" onSubmit={this.handleVerify}>
					<h1>Sign Up</h1>
					<br />
					<br />
					<div className="form-group">
						<label>Full Name</label>
						<input type="text" name="name" className="form-control" placeholder="First name" onChange={this.handleChange} required />
					</div>

					<div className="form-group">
						<label>Email Address</label>
						<input
							type="email"
							name="email"
							id="validate"
							className="form-control"
							placeholder="Enter email"
							onChange={this.handleChange}
							onFocus={() => document.getElementById("validate").classList.remove("is-invalid")}
							required
						/>
					</div>

					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							name="pass"
							className="form-control"
							placeholder="Enter password"
							onChange={this.handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label>Profile Picture</label>
						<input
							type="file"
							className="form-control"
							name="avatar"
							accept="image/*"
							onChange={(e) => this.setState({ file: e.target.files[0] })}
						/>
					</div>
					<br />
					<br />
					<button type="submit" className="btn btn-primary btn-block custom-input">
						Sign Up
					</button>
					<br />
					<p className="forgot-password text-center">
						Already registered? <a href="/login">Login</a>
					</p>
				</form>

				{/* Hidden Modal */}
				<Modal show={this.state.show} onHide={() => this.setState({ ...this.state, show: false })} backdrop="static" keyboard={false}>
					<Modal.Header>
						<Modal.Title>Got an email ?</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<input
							type="number"
							name="code"
							className="form-control"
							placeholder="Enter the given code"
							onChange={this.handleChange}
							required
							autoComplete="off"
							width="auto"
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="primary" onClick={this.handleSubmit}>
							Confirm
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
