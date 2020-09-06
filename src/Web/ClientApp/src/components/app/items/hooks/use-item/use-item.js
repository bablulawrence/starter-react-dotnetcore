import { useReducer, useEffect, useContext } from 'react';
import useAzureBlob from '../use-azure-blob';
import itemReducer from './item-reducer';
import AppContext from '../../../contexts/app-context';

import {
	ADD_ITEM,
	UPDATE_ITEM,
	DELETE_ITEM,
	RESET_ITEMS,
	SET_IS_LOADING,
} from './actions';

export default () => {
	const [state, dispatch] = useReducer(itemReducer, {
		items: [],
		isLoading: false,
	});
	const { getAccessToken } = useContext(AppContext);

	const [getBlobUri, uploadBlob] = useAzureBlob({
		storageAccountName: process.env.REACT_APP_AZURE_STRG_ACCT_NAME,
		containerName: 'items',
	});

	async function getToken() {
		const response = await getAccessToken({
			scopes: [
				`${process.env.REACT_APP_AAD_API_APP_CLIENT_ID}/StarterApp.ReadWrite`,
			],
		});

		return response.accessToken;
	}

	const search = async (searchText) => {
		let items = [];
		dispatch({ type: SET_IS_LOADING, payload: true });
		try {
			const response = await fetch(
				`/api/items/search?top=2&searchText=${searchText}`,
				{
					method: 'POST',
					headers: {
						Authorization: 'Bearer ' + (await getToken()),
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						Skip: 0,
						Top: 10,
						SearchFields: ['Title', 'Description'],
						Select: [
							'ItemId',
							'Title',
							'Description',
							'FileName',
							'DateAdded',
						],
						OrderBy: ['DateAdded desc'],
					}),
				},
			);
			if (response.ok) {
				const data = (await response.json()).results;
				data.map((d) => items.push(d.document));
			}
		} catch (error) {
			throw error;
		}
		dispatch({ type: SET_IS_LOADING, payload: false });
		return items;
	};

	useEffect(() => {
		async function fetchData() {
			const items = await search('*');
			dispatch({ type: ADD_ITEM, payload: items });
		}
		fetchData();
	}, []);

	const searchItems = async (searchText) => {
		const items = await search(searchText);
		dispatch({ type: RESET_ITEMS, payload: items });
	};

	const getItemFileLink = async (itemId) => {
		const headers = {
			Authorization: `Bearer ${await getToken()}`,
		};
		try {
			const response = await fetch(`/api/items/${itemId}`, {
				method: 'GET',
				headers: headers,
			});
			if (response.ok) {
				const item = await response.json();
				return getBlobUri(item.fileName);
			}
		} catch (error) {
			throw error;
		}
	};

	const addItem = async (item) => {
		const fileName = await uploadBlob(item.fileList[0]);
		const headers = {
			Authorization: `Bearer ${await getToken()}`,
			'Content-Type': 'application/json',
		};
		try {
			const response = await fetch(`/api/items`, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					title: item.title,
					description: item.description,
					fileName: fileName,
				}),
			});
			if (response.ok) {
				const item = await response.json();
				dispatch({ type: ADD_ITEM, payload: item });
				return true;
			} else return false;
		} catch (error) {
			throw error;
		}
	};

	const deleteItem = async (itemId) => {
		const headers = {
			Authorization: `Bearer ${await getToken()}`,
		};
		try {
			const response = await fetch(`/api/items/${itemId}`, {
				method: 'DELETE',
				headers: headers,
			});
			if (response.ok) {
				dispatch({ type: DELETE_ITEM, payload: parseInt(itemId) });
				return true;
			} else return false;
		} catch (error) {
			throw error;
		}
	};

	const updateItem = async (item) => {
		let fileName = item.fileName;
		if (item.fileList.length > 0) {
			fileName = await uploadBlob(item.fileList[0]);
		}
		const headers = {
			Authorization: `Bearer ${await getToken()}`,
			'Content-Type': 'application/json',
		};
		try {
			const response = await fetch(`/api/items/${item.itemId}`, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify({
					title: item.title,
					description: item.description,
					fileName: fileName,
				}),
			});
			if (response.ok) {
				const item = await response.json();
				dispatch({ type: UPDATE_ITEM, payload: item });
				return true;
			} else return false;
		} catch (error) {
			throw error;
		}
	};

	return {
		...state,
		getItemFileLink,
		searchItems,
		addItem,
		deleteItem,
		updateItem,
	};
};
