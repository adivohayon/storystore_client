import _get from 'lodash/get';
export default {
	name: 'checkout-order',
	components: {},
	props: {
		shippingAddress: {
			type: String,
		},
	},
	data() {
		return {};
	},
	async mounted() {
		if (this.orderQuery === 'error') {
			setTimeout(() => {
				this.toggle();
			}, 1500);
		}

		if (
			this.orderQuery === 'success' &&
			this.orderId &&
			this.orderEmail &&
			validateEmail(this.orderEmail)
		) {
			setTimeout(() => {
				this.toggle();
			}, 1500);
			await this.$axios.$post('order/new-order-email', {
				to: this.orderEmail,
				orderId: this.orderId,
			});
			if (this.lastPurchase) {
				this.trackPurchase(this.lastPurchase);
			}
		}
	},
	computed: {
		storeSlug() {
			return _get(this.$store.state, 'store.slug', null);
		},
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		itemsImages() {
			const imgs = this.items.map(item => {
				return item.image;
			});
			return imgs;
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
