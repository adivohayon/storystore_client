import axios from 'axios';
export class WooCommerce {
	constructor(baseUrl, axios) {
		this.axios = axios;
		this.baseUrl = baseUrl;
		this.cartEndpoint = '/wp-json/wc/v2/cart';
	}

	getCart() {
		return axios.get(this.baseUrl + this.cartEndpoint);
	}
	addToCart(productId, quantity = 1, variationId, variationAttributes) {
		if (!productId) {
			return Promise.reject();
		}
		const payload = {
			product_id: productId,
			quantity,
			...(variationId && { variation_id: variationId }),
			...(variationAttributes && { variation: variationAttributes }),
		};
		console.log('WooCommerce Service / addToCart / payload', payload);
		return this.axios
			.$post(this.baseUrl + this.cartEndpoint + '/add', payload, {
				withCredentials: true,
				headers: { 'Content-Type': 'application/json' },
			})
			.catch(err => {
				console.error(
					'WooCommerce Service / addToCart / Error',
					err.response.data.message
				);
			});
	}
}
