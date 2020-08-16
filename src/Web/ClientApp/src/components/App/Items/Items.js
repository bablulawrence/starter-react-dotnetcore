import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import useItem from './hooks/use-item';
import ItemList from './item-list';
import AddItem from './add-item';
import UpdateItem from './update-item';

export default () => {
	const { path } = useRouteMatch();

	const {
		items,
		isLoading,
		getItemFileLink,
		searchItems,
		addItem,
		deleteItem,
		updateItem,
	} = useItem({
		items: [],
	});

	return (
		<Switch>
			<Route
				exact
				path={path}
				render={() => (
					<ItemList
						items={items}
						isLoading={isLoading}
						getItemFileLink={getItemFileLink}
						searchItems={searchItems}
						deleteItem={deleteItem}
					/>
				)}
			/>
			<Route path={`${path}/add`}>
				<AddItem items={items} addItem={addItem} />
			</Route>
			<Route path={`${path}/update/:itemId`}>
				<UpdateItem items={items} updateItem={updateItem} />
			</Route>
		</Switch>
	);
};
