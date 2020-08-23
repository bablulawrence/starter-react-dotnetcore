import {
	ADD_ITEM,
	UPDATE_ITEM,
	DELETE_ITEM,
	RESET_ITEMS,
	SET_IS_LOADING,
} from './actions';
import { firstBy } from 'thenby';

function addItem(state, item) {
	if (state.items.some((i) => i.itemId === item.itemId.toString()))
		return { ...state };
	else {
		const items = [...state.items];
		items.push(item);
		items.sort(firstBy('dateAdded', 'desc'));
		return { ...state, items: items };
	}
}

function updateItem(state, item) {
	if (state.items.some((i) => i.itemId === item.itemId.toString())) {
		const items = state.items.filter(
			(i) => i.itemId !== item.itemId.toString(),
		);
		items.push(item);
		items.sort(firstBy('dateAdded', 'desc'));
		return {
			...state,
			items: items,
		};
	} else return { ...state };
}

function deleteItem(state, itemId) {
	if (state.items.some((i) => i.itemId === itemId.toString())) {
		const items = state.items.filter(
			(i) => i.itemId !== itemId.toString(),
		);
		items.sort(firstBy('dateAdded', 'desc'));
		return {
			...state,
			items: items,
		};
	} else return { ...state };
}

export default function reducer(state = { items: [] }, action) {
	switch (action.type) {
		case SET_IS_LOADING:
			return { ...state, isLoading: action.payload };
		case ADD_ITEM:
			if (Array.isArray(action.payload)) {
				let s = state;
				action.payload.map((item) => (s = addItem(s, item)));
				return s;
			} else return addItem(state, action.payload);
		case UPDATE_ITEM:
			if (Array.isArray(action.payload)) {
				let s = state;
				action.payload.map((item) => (s = updateItem(s, item)));
				return s;
			} else return updateItem(state, action.payload);
		case DELETE_ITEM:
			if (Array.isArray(action.payload)) {
				let s = state;
				action.payload.map((item) => (s = deleteItem(s, item)));
				return s;
			} else return deleteItem(state, action.payload);
		case RESET_ITEMS:
			if (Array.isArray(action.payload)) {
				return {
					...state,
					items: action.payload,
				};
			} else
				return {
					...state,
					items: [].push(action.payload),
				};
		default:
			return state;
	}
}
