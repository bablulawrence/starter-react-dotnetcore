import { createContext } from 'react';

export default createContext({
	setMessage: (status, text) => {},
	getAccessToken: () => {},
});
