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
				let external_id = _get(
					item,
					'attributes.fashion_simple_size.external_id',
					null
				);
				console.log('external id', external_id);
				if (!external_id) {
					continue;
				}
				queryString += 'q=' + external_id + '&';
			}
			console.log('$$$$', queryString);
			if (queryString == '?') {
				return;
			}
			// UTM
			let utmString = location.search;
			utmString = utmString.substr(1);
			console.log('utm string', utmString.substr(1));
			if (baseUrl && cartEndpoint && utmString) {
				const checkoutLink = baseUrl + cartEndpoint;
				const path = this.$route.path;
				const lastIndex = path.lastIndexOf('/');
				const influencer = path.substr(lastIndex + 1);
				console.log(
					'cart.page / hoodiesCheckoutLink / $route.path',
					influencer
				);
				console.log(
					'cart.page / hoodiesCheckoutLink',
					checkoutLink + queryString + 'i=' + influencer + '&' + utmString
				);
				return checkoutLink + queryString + 'i=' + influencer + '&' + utmString;
			}
		},
		goToHoodiesCheckout() {
			const url = this.getHoodiesCheckoutLink();
			window.location.href = url;
		},
	},
};
