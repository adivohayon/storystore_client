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
			type: Number,
		},
		currency: {
			type: String,
			default: '‎₪',
		},
	},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		addToCart(sku) {
			this.$store.commit('cart/add', {
				...sku,
				quantity: 1,
				price: this.price,
				currency: this.currency,
			});
			console.log('Add to cart', sku);
		},
	},
};
