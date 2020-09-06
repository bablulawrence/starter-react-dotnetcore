import { useEffect, useState, useContext } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import AppContext from '../../../contexts/app-context';

export default (initialState) => {
	const [blobInfo, setBlobInfo] = useState(initialState);
	const { getAccessToken } = useContext(AppContext);

	useEffect(() => {
		async function fetchData() {
			const response = await getAccessToken({
				scopes: [
					`${process.env.REACT_APP_AAD_API_APP_CLIENT_ID}/StarterApp.ReadWrite`,
				],
			});

			const headers = {
				Authorization: `Bearer ${response.accessToken}`,
			};

			let containerReadSas = null;
			try {
				const response = await fetch(`/api/items/key`, {
					method: 'GET',
					headers: headers,
				});
				if (response.ok) {
					containerReadSas = (await response.json()).key;
				}
			} catch (error) {
				throw error;
			}

			let containerWriteSas = null;
			try {
				const response = await fetch(
					'/api/items/key?permissions=-1&expireDurationInHours=1',
					{
						method: 'GET',
						headers: headers,
					},
				);
				if (response.ok) {
					containerWriteSas = (await response.json()).key;
				}
			} catch (error) {
				throw error;
			}

			const blobServiceClient = new BlobServiceClient(
				`https://${blobInfo.storageAccountName}.blob.core.windows.net?${containerWriteSas}`,
			);
			const containerClient = blobServiceClient.getContainerClient(
				blobInfo.containerName,
			);
			setBlobInfo({
				...blobInfo,
				containerReadSas,
				containerClient,
			});
		}
		fetchData();
	}, [blobInfo, getAccessToken]);

	const getBlobUri = (fileName) => {
		const { storageAccountName, containerName, containerReadSas } = {
			...blobInfo,
		};
		return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${fileName}?${containerReadSas}`;
	};

	const uploadBlob = async (file) => {
		let [fileName, extension] = file.name.split('.');
		fileName += '_' + new Date().getTime() + '.' + extension;
		const blockBlobClient = blobInfo.containerClient.getBlockBlobClient(
			fileName,
		);
		await blockBlobClient.uploadBrowserData(file);
		return fileName;
	};

	return [getBlobUri, uploadBlob];
};
