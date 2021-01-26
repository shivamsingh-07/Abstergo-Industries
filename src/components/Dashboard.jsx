import React, { Component } from "react";
import { NavBar } from "./NavBar";

export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: this.props.auth,
			amt: null,
			sub: false,
		};
	}

	render() {
		return (
			<div className="container">
				<NavBar />
				<h1>Dear {this.state.user.name},</h1>
				<br />
				<br />
				<h5>
					Thanks for being a part of this community. You can donate us in the donate section. Your little contribution is really helpful.
				</h5>
			</div>
		);
	}
}
