import React, { useState } from 'react';
import styles from './search-bar.module.css';
import { Form, FormControl, Button } from 'react-bootstrap';
import image from '../../../../../assets/images/search.svg';

const SearchBar = ({ searchItems }) => {
	const [searchText, setSearchText] = useState('');

	const handleSearch = (event) => {
		if (searchText.length === 0) searchItems('*');
		else searchItems(searchText);
		event.preventDefault();
		event.stopPropagation();
	};

	return (
		<Form
			inline
			className={styles.SearchBar}
			onSubmit={(event) => {
				handleSearch(event);
			}}
		>
			<FormControl
				className={styles.SearchBox}
				style={{ width: '90%' }}
				type="text"
				placeholder="Search for items"
				onChange={(e) => setSearchText(e.target.value)}
			/>
			<Button
				variant="light"
				onClick={(event) => {
					handleSearch(event);
				}}
			>
				<img src={image} alt="Search" />
			</Button>
		</Form>
	);
};

export default SearchBar;
