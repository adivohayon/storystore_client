import axios from 'axios';

export default class Hoodies {
	constructor(integrations) {
		this.API_Url =
			integrations.baseUrl || 'https://www.hoodies.co.il/Handlers/';
		this.cartEndpoint = integrations.cart || 'CreateCartHandler.ashx';
		this.axiosConfig = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			// withCredentials: false,
		};
	}

	async cart(itemId) {
		const payload = `q=${itemId}`;
		try {
			const resp = await axios.post(
				this.API_Url + this.cartEndpoint,
				payload,
				this.axiosConfig
			);

			console.log('resp', resp);
			// const data = resp.data;
			if (!data) {
				throw new Error('No data returned');
			}

			// const returnedItem = data[4] ? JSON.parse(data[4]) : null;
			if (!returnedItem) {
				throw new Error('There was a problem updating the cart...');
			}
			return data;
		} catch (err) {
			console.error(err);
		}
	}
}
