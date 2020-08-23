import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import styles from './app.module.css';
import Items from './items';
import Navbar from './navbar';
import AppContext from './contexts/app-context';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

const useMessage = (initialState) => {
	const [message, setMessage] = useState(initialState);
	return [
		message,
		(status, text) => {
			if (status === 'success') {
				setMessage({
					type: 'success',
					text: text,
				});
			} else if (status === 'failure') {
				setMessage({
					type: 'danger',
					text: text,
				});
			} else {
				setMessage({
					type: 'info',
					text: text,
				});
			}
			window.setTimeout(() => {
				setMessage({
					type: 'success',
					text: '',
				});
			}, 2000);
		},
	];
};

export default ({ logout, accountInfo, getAccessToken }) => {
	const [message, setMessage] = useMessage({
		show: false,
	});

	return (
		<AppContext.Provider
			value={{
				userName: accountInfo.account.name,
				userEmail: accountInfo.account.userName,
				setMessage,
				getAccessToken,
				logout,
			}}
		>
			<Router>
				<Container className={styles.App}>
					<Navbar title="React ASP.Net Core MVC Starter Template" />
					<Row>
						<Col xs={10}></Col>
						<Col xs={2}>
							<Badge
								className="float-right"
								pill
								variant={message.type}
							>
								{message.text}
							</Badge>
						</Col>
					</Row>
					<Switch>
						<Route exact path="/">
							<Redirect to="/items" />
						</Route>
						<Route path="/items">
							<Items />
						</Route>
					</Switch>
				</Container>
			</Router>
		</AppContext.Provider>
	);
};
