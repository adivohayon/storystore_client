import _get from 'lodash.get';
export const hoodies = {
	data() {
		return {};
	},
	computed: {
		hoodiesCustom() {
			const integrationType = _get(
				this.$store.state,
				'store.settings.integrations.type',
				null
			);
			console.log('cart page / hoodiesCustom', integrationType);
			if (integrationType && integrationType === 'HOODIES_CUSTOM') {
				return true;
			}
		},
	},
	methods: {
		getHoodiesCheckoutLink() {
			const baseUrl = _get(
				this.$store.state,
				'store.settings.integrations.baseUrl',
				null
			);
			const cartEndpoint = _get(
				this.$store.state,
				'store.settings.integrations.cart',
				null
			);
			const items = [];
			const cartItems = this.$store.getters['cart/items']('hoodies');
			console.log('hoodies / cartItems', cartItems);
			let queryString = '?';
			for (const item of cartItems) {
				console.log('item', item);
				let externalId = _get(
					item,
					'attributes.fashion_simple_size.externalId',
					null
				);
				console.log('external id', externalId);
				if (!externalId) {
					continue;
				}
				queryString += 'q=' + externalId + '&';
			}
			console.log('$$$$', queryString);
			if (queryString == '?') {
				return;
			}
			// cartItems.forEach(item => {
			// 	let externalId = item.attributes.fashion_simple_size.externalId;
			// 	items.push(externalId);
			// });
			// console.log('hoodies / items', items);
			// const items = [
			// 	'2136_23908_1.416072.0_2.415194.0',
			// 	'2136_23908_1.416070.0_2.415194.0',
			// ];
			if (baseUrl && cartEndpoint) {
				const checkoutLink = baseUrl + cartEndpoint;
				console.log(
					'cart.page / hoodiesCheckoutLink',
					checkoutLink + queryString
				);
				return checkoutLink + queryString;
			}
		},
		goToHoodiesCheckout() {
			const url = this.getHoodiesCheckoutLink();
			window.location.href = url;
		},
	},
};
