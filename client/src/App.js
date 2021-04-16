import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Account from "./components/Account";
import Dashboard from "./components/Dashboard";
import Donation from "./components/Donation";
import ProtectedRoute from "./ProtectedRoute";

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<ProtectedRoute path="/dashboard" component={Dashboard} />
					<ProtectedRoute path="/account" component={Account} />
					<ProtectedRoute path="/donation" component={Donation} />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
