import React, { useContext } from 'react';
import { Spinner, Table, Col, Row, Button } from 'react-bootstrap';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Moment from 'react-moment';
import styles from './item-list.module.css';
import SearchBar from './search-bar';
import AppContext from '../../contexts/app-context';

export default ({
	items,
	isLoading,
	getItemFileLink,
	searchItems,
	deleteItem,
}) => {
	const history = useHistory();
	const { path } = useRouteMatch();
	const { setMessage } = useContext(AppContext);

	const handleDelete = async (itemId) => {
		(await deleteItem(itemId))
			? setMessage('success', 'Item Deleted')
			: setMessage('failure', 'Error while deleting item');
	};

	return (
		<span className={styles.ItemList}>
			<Row className={styles.SearchBar}>
				<Col xs={6}>
					<SearchBar searchItems={searchItems} />
				</Col>
				<Col xs={{ span: 2, offset: 4 }}>
					<Button
						className="float-right"
						variant="primary"
						onClick={() => history.push(`${path}/add`)}
					>
						Add Item
					</Button>
				</Col>
			</Row>
			{isLoading ? (
				<Col xs={6}>
					<Spinner
						variant="dark"
						animation="border"
						className="float-right"
					/>
				</Col>
			) : (
				<Table responsive striped bordered hover size="sm">
					<thead>
						<tr>
							<th>Id</th>
							<th>Title</th>
							<th>Description</th>
							<th>File</th>
							<th>Date Added</th>
							<th>Delete</th>
							<th>Update</th>
						</tr>
						{items.map((item) => (
							<tr key={item.itemId}>
								<td>{item.itemId}</td>
								<td className={styles.Title}>{item.title}</td>
								<td className={styles.Description}>
									{item.description}
								</td>
								<td>
									<Button
										variant="link"
										onClick={async () => {
											const a = document.createElement('a');
											a.href = await getItemFileLink(item.itemId);
											a.click();
										}}
									>
										{item.fileName}
									</Button>
								</td>
								<td className={styles.DateAdded}>
									<Moment>{item.dateAdded}</Moment>
								</td>
								<td>
									{' '}
									<Button
										variant="outline-primary"
										size="sm"
										onClick={() => handleDelete(item.itemId)}
									>
										-
									</Button>
								</td>
								<td>
									{' '}
									<Button
										variant="outline-primary"
										size="sm"
										onClick={() =>
											history.push(`${path}/update/${item.itemId}`)
										}
									>
										^
									</Button>
								</td>
							</tr>
						))}
					</thead>
				</Table>
			)}
		</span>
	);
};
