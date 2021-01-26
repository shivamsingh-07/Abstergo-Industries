import React, { Component } from "react";
import { Button, Image } from "react-bootstrap";
import NavBar from "./NavBar";
import Axios from "axios";

export class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.auth,
			amt: null,
			sub: false,
		};
	}

	createSession = async (event) => {
		event.preventDefault();
		const session = await Axios.post(
			process.env.REACT_APP_API_URL + "/pay/portal-session",
			{ custID: this.state.user.custId },
			{
				withCredentials: true,
			}
		);
		window.location.href = session.data.url;
	};

	render() {
		const { name, email } = this.state.user;
		return (
			<div className="container">
				<NavBar />
				<Image src={this.state.user.avatarUrl} width="300" height="300" roundedCircle />
				<br />
				<br />
				<h1>Welcome, {name}</h1>
				<h5>
					<b>Email: </b>
					{email}
				</h5>
				<br />
				<br />
				<form method="POST" onSubmit={this.createSession}>
					<Button type="submit">Manage Billing</Button>
				</form>
			</div>
		);
	}
}

export default Account;
