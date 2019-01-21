import { throws } from 'assert';

export default {
	name: 'add-to-cart',
	components: {},
	props: {
		sku: {
			type: Object,
			default() {
				return {};
			},
		},
		price: {
			type: String,
		},
		currency: {
			type: String,
			default: '‎₪',
		},
		colors: {
			type: Array,
			default() {
				return [];
			},
		},
		sizes: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		storeSlug() {
			console.log('params', this.$route.params);
			return this.$route.params.storeSlug || null;
			// this.$route
		},
	},
	created() {},
	mounted() {
		console.log('params', this.$route.params);
	},
	methods: {
		addToCart(sku) {
			this.$store.commit('cart/add', {
				...sku,
				quantity: 1,
				price: this.price,
				currency: this.currency,
				variations: {
					colors: this.colors,
					sizes: this.sizes,
				},
				storeSlug: this.storeSlug,
			});
			console.log('Add to cart', sku);
		},
	},
};
