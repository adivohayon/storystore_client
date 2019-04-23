import _get from 'lodash/get';
export default {
	name: 'order-summary',
	components: {},
	props: {
		shippingAddress: {
			type: String,
		},
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		storeSlug() {
			return _get(this.$store.state, 'store.slug', null);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		total() {
			if (this.subtotal) {
				if (this.selectedShipping && this.selectedShipping.price >= 0) {
					return this.subtotal + this.selectedShipping.price;
				} else {
					return this.subtotal;
				}
			} else {
				return 0;
			}
		},
		currency() {
			return '₪';
		},
		selectedShipping() {
			return _get(this.$store.state, 'checkout.shippingOption', {});
		},
	},
	methods: {},
};
