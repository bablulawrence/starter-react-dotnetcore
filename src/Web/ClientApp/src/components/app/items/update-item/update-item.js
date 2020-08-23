import React, { useContext, useEffect } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import styles from './update-item.module.css';
import AppContext from '../../contexts/app-context';
import useFormFields from '../hooks/use-form-fields';

export default ({ items, updateItem }) => {
	const { setMessage } = useContext(AppContext);
	const history = useHistory();
	const { itemId } = useParams();

	const [fields, setFieldValues, handleFieldChange] = useFormFields({
		title: '',
		description: '',
		fileName: '',
		fileList: '',
		isReplaceFile: false,
		isFormUpdated: false,
	});

	useEffect(() => {
		if (items.length > 0) {
			const item = items.filter((item) => item.itemId === itemId)[0];
			setFieldValues({
				itemId: item.itemId,
				title: item.title,
				description: item.description,
				fileName: item.fileName,
				fileList: '',
			});
		}
	}, [items, itemId]);

	const validateForm = () =>
		fields.isReplaceFile
			? fields.title.length > 0 &&
			  fields.description.length > 0 &&
			  fields.fileList.length > 0 &&
			  fields.isFormUpdated
			: fields.title.length > 0 &&
			  fields.description.length > 0 &&
			  fields.isFormUpdated;

	const handleSubmit = async (event, item) => {
		(await updateItem(item))
			? setMessage('success', 'Item updated')
			: setMessage('failure', 'Error while updating item');
		history.goBack();
	};

	return (
		<Col xs={7}>
			<Form className={styles.UpdateItem}>
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
				<Form.Check
					id="isReplaceFile"
					label={`Replace file - ${fields.fileName}`}
					onChange={handleFieldChange}
				/>
				{fields.isReplaceFile ? (
					<Form.File
						id="fileList"
						label="Choose file"
						onChange={handleFieldChange}
					></Form.File>
				) : null}
				<Row>
					<Col xs={3}>
						<Button
							variant="primary"
							disabled={!validateForm()}
							onClick={(event) => handleSubmit(event, fields)}
						>
							Update Item
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
