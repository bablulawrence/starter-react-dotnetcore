import { useState } from 'react';

export default (initialState) => {
	const [fields, setValues] = useState(initialState);

	return [
		fields,
		(fields) => setValues(fields),
		(event) => {
			const statusField = 'isFormUpdated';
			if (event.target.type === 'checkbox') {
				setValues({
					...fields,
					[event.target.id]: fields[event.target.id] ? false : true,
				});
			} else if (event.target.type === 'file') {
				setValues({
					...fields,
					[event.target.id]: event.target.files,
					[statusField]: true,
				});
			} else {
				setValues({
					...fields,
					[event.target.id]: event.target.value,
					[statusField]: true,
				});
			}
		},
	];
};
