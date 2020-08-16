import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import App from './components/app';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { authProvider } from './components/auth';

ReactDOM.render(
	<AzureAD provider={authProvider} forceLogin={true}>
		{({ login, logout, authenticationState, error, accountInfo }) => {
			switch (authenticationState) {
				case AuthenticationState.Authenticated:
					return (
						<App
							logout={logout}
							accountInfo={accountInfo}
							getAccessToken={authProvider.getAccessToken}
						/>
					);
				case AuthenticationState.InProgress:
					return <p>Authenticating...</p>;
				default:
				case AuthenticationState.Unauthenticated:
					return error ? (
						<div>
							<p>
								<span>
									An error occured during authentication, try again!
								</span>
							</p>
							<Button variant="outline-dark" onClick={login}>
								Login
							</Button>
						</div>
					) : null;
			}
		}}
	</AzureAD>,
	document.getElementById('root'),
);
