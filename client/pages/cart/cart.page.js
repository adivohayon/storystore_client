import CartItem from '@/components/cart-item';
import { hoodies } from '@/mixins/hoodies.js';
import '@/icons';
import { getSubdomainFromHost } from '@/helpers/async-data.helpers';
import _get from 'lodash.get';
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	mixins: [pageHeadMixin, hoodies],
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
	data() {
		return {};
	},
	mounted() {},
	// watch: {
	// 	itemsCount: function(newVal) {
	// 		if (typeof dataLayer !== 'undefined' && dataLayer && newVal > 0) {
	// 			console.log('dataLayer', dataLayer);
	// 			this.$analytics.goToCart(newVal);
	// 		}
	// 	},
	// },
	computed: {
		// referer() {
		// 	console
		// },
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		itemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		integrations() {
			const integrations = _get(
				this.$store.state,
				'store.settings.integrations',
				null
			);
			return integrations;
		},
		integrationCart() {
			const integrationCart = this.integrations.find(
				integration => integration.type === 'CART'
			);
			return integrationCart;
		},
	},
	methods: {
		goToCheckout() {
			const checkoutUrl = this.$integrations.cart.service.checkoutUrl;
			if (this.integrations && this.integrationCart && checkoutUrl) {
				console.log('checkoutUrl', checkoutUrl);
				this.$store.dispatch('toggleLoader', true);
				this.$analytics.goToCheckout(this.subtotal);
				window.location.href = checkoutUrl;
				// this.goToHoodiesCheckout();
			} else {
				this.$analytics.goToCheckout(this.subtotal);
				this.$router.replace('/checkout/shipping-options');
			}
		},
		back() {
			// window.history.back();
			this.$router.back();
		},
	},
};
