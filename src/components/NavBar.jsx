import React, { Component } from "react";
import { Button, Navbar, Nav } from "react-bootstrap";
import Axios from "axios";

export class NavBar extends Component {
	handleLogout = () => {
		Axios.post(process.env.REACT_APP_API_URL + "/auth/logout", {}, { withCredentials: true }).then(() => (window.location.href = "/"));
	};

	render() {
		return (
			<Navbar bg="light" expand="xl" fixed="top">
				<Navbar.Brand>
					<img src="assets/images/logo.png" alt="Logo" width="40" />
				</Navbar.Brand>
				<Navbar.Brand>Abstergo Industries</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link href="/dashboard">Home</Nav.Link>
						<Nav.Link href="/account">Account</Nav.Link>
					</Nav>
					<Button variant="info" className="mr-3 custom-input" href="/donation">
						Donate &hearts;
					</Button>
					<Button variant="danger" onClick={this.handleLogout}>
						Logout
					</Button>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export default NavBar;
