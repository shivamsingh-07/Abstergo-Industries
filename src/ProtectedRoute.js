import { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import Axios from "axios";

function ProtectedRoute({ component: Component, ...rest }) {
	const [auth, setAuth] = useState(null);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({});

	useEffect(() => {
		(async () => {
			try {
				await Axios.post(process.env.REACT_APP_API_URL + "/auth", {}, { withCredentials: true }).then((response) => {
					if (response.status === 200 && response.data) {
						setAuth(true);
						setUser(response.data);
					}
				});
			} catch (error) {
				console.log(error);
			}
			setLoading(true);
		})();
	}, []);

	if (loading)
		return (
			<Route
				{...rest}
				render={(props) => {
					if (auth) return <Component auth={user} />;
					else return <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
				}}
			/>
		);
	return <></>;
}

export default ProtectedRoute;
