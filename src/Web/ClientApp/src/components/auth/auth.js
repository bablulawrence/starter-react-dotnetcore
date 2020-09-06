import { MsalAuthProvider, LoginType } from 'react-aad-msal';

const config = {
	auth: {
		authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AAD_TENANT_ID}`,
		clientId: process.env.REACT_APP_AAD_CLIENT_APP_CLIENT_ID,
		redirectUri: window.location.origin,
		postLogoutRedirectUri:
			process.env.REACT_APP_AAD_POST_LOGOUT_REDIRECT_URI,
	},
	cache: {
		cacheLocation: 'localStorage',
		storeAuthStateInCookie: true,
	},
};

const authenticationParameters = {
	scopes: [
		'https://graph.microsoft.com/User.Read',
		`${process.env.REACT_APP_AAD_API_APP_CLIENT_ID}/StarterApp.ReadWrite`,
	],
};

const options = {
	loginType: LoginType.Redirect,
	tokenRefreshUri: window.location.origin + '/auth.html',
};

export const authProvider = new MsalAuthProvider(
	config,
	authenticationParameters,
	options,
);
