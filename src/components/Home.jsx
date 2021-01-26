import React, { Component } from "react";
import { Button } from "react-bootstrap";

export class Home extends Component {
	render() {
		return (
			<div className="container">
				<img src="assets/images/logo.png" alt="Logo" className="homeimg" />
				<h1 className="title">Abstergo Industries</h1>
				<br />
				<br />
				<span>We are a community of great people.</span>
				<br />
				<br />
				<br />
				<Button variant="primary" href="/login">
					Join Us
				</Button>
			</div>
		);
	}
}

export default Home;
