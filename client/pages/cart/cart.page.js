import CartItem from '@/components/cart-item';
import { hoodies } from '@/mixins/hoodies.js';
import '@/icons';
import { getSubdomainFromHost } from '@/helpers/async-data.helpers';
import _get from 'lodash.get';
export default {
	mixins: [hoodies],
	components: { CartItem },
	async asyncData({ req, store }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSubdomainFromHost(host);

		store.commit('toggleLoader', false);

		return {
			storeSlug,
		};
	},
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	head() {
		const storeSlug = this.$store.state.store.slug;
		const faviconPath =
			process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;

		return {
			title:
				this.$store.state.store.name + ' - ' + this.$store.state.store.tagline,
			link: [{ rel: 'icon', href: faviconPath }],
		};
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		itemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		// hoodiesCustom() {
		// 	const integrationType = _get(
		// 		this.$store.state,
		// 		'store.settings.integrations.type',
		// 		null
		// 	);
		// 	console.log('cart page / hoodiesCustom', integrationType);
		// 	if (integrationType && integrationType === 'HOODIES_CUSTOM') {
		// 		return true;
		// 	}
		// },
		// hoodiesCheckoutLink() {
		// 	return this.getHoodiesCheckoutLink();
		// },
		// hoodiesCheckoutLink() {
		// 	const baseUrl = _get(
		// 		this.$store.state,
		// 		'store.settings.integrations.baseUrl',
		// 		null
		// 	);
		// 	const cart = _get(
		// 		this.$store.state,
		// 		'store.settings.integrations.cart',
		// 		null
		// 	);
		// 	const items = [
		// 		'2136_23908_1.416072.0_2.415194.0',
		// 		'2136_23908_1.416070.0_2.415194.0',
		// 	];
		// 	if (baseUrl && cart && items) {
		// 		const checkoutLink = baseUrl + cart;
		// 		let queryString = '?';
		// 		items.forEach(item => {
		// 			queryString += 'q=' + item + '&';
		// 		});
		// 		console.log(
		// 			'cart.page / hoodiesCheckoutLink',
		// 			checkoutLink + queryString
		// 		);
		// 		return checkoutLink + queryString;
		// 	}
		// },
	},
	methods: {
		goToCheckout() {
			if (this.hoodiesCustom) {
				this.goToHoodiesCheckout();
			} else {
				this.$router.replace('/checkout/shipping-options');
			}
		},
	},
};
