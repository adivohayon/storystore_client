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
			let checkoutLink = '';
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

			if (!baseUrl || !cartEndpoint) {
				throw new Error('Hoodies / Could not find baseUrl or cart endpoint');
			}

			checkoutLink = baseUrl + cartEndpoint;

			// HANDLE ITEMS
			const cartItems = this.$store.getters['cart/items']('hoodies');
			let queryString = '';
			for (const item of cartItems) {
				let external_id = _get(
					item,
					'attributes.fashion_simple_size.external_id',
					null
				);
				if (!external_id) {
					continue;
				}
				queryString += 'q=' + external_id + '&';
			}

			// HANDLE INFLUENCER
			const path = this.$route.path;
			const matchStr = 'influencers/';
			const lastIndex = path.lastIndexOf(matchStr) + matchStr.length;
			const influencer = path.substr(lastIndex);

			if (!influencer) {
				throw new Error('influencer not found');
			}
			queryString += 'i=' + influencer;

			// ADDS CURRENT QUERY STRING TO LINK
			console.log('currentQueryStr', currentQueryStr);
			let currentQueryStr = location.search.substr(1);
			if (currentQueryStr) {
				queryString += `&${currentQueryStr}`;
			}

			checkoutLink += `?${queryString}`;
			console.log('cart.page / hoodiesCheckoutLink', checkoutLink);
		},
		goToHoodiesCheckout() {
			const url = this.getHoodiesCheckoutLink();
			window.location.href = url;
		},
	},
};
