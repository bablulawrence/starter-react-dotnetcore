import React, { useContext } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import styles from './add-item.module.css';
import AppContext from '../../contexts/app-context';
import useFormFields from '../hooks/use-form-fields';

export default ({ items, addItem }) => {
	const { setMessage } = useContext(AppContext);
	const history = useHistory();
	const { 0: fields, 2: handleFieldChange } = useFormFields({
		title: '',
		description: '',
		fileName: '',
		fileList: '',
	});

	const validateForm = () =>
		fields.title.length > 0 &&
		fields.description.length > 0 &&
		fields.fileList.length > 0;

	const handleSubmit = async (event, item) => {
		await addItem(item)
			? setMessage('success', 'Item added')
			: setMessage('failure', 'Error while adding item');
		history.goBack();
	};

	return (
		<Col xs={7}>
			<Form className={styles.AddItem}>
				<Form.Group controlId="title">
					<Form.Label>Title</Form.Label>
					<Form.Control
						type="text"
						maxLength={150}
						value={fields.title}
						onChange={handleFieldChange}
					/>
				</Form.Group>
				<Form.Group controlId="description">
					<Form.Label>Description</Form.Label>
					<Form.Control
						as="textarea"
						rows="5"
						maxLength={1000}
						value={fields.description}
						onChange={handleFieldChange}
					/>
				</Form.Group>
				<Form.File
					id="fileList"
					label="Choose file"
					onChange={handleFieldChange}
				></Form.File>
				<Row>
					<Col xs={3}>
						<Button
							variant="primary"
							disabled={!validateForm()}
							onClick={(event) => handleSubmit(event, fields)}
						>
							Add Item
						</Button>
					</Col>
					<Col xs={3}>
						<Button
							variant="secondary"
							onClick={() => history.goBack()}
						>
							Cancel
						</Button>
					</Col>
				</Row>
			</Form>
		</Col>
	);
};
