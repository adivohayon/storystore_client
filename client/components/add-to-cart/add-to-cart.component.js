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
	},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		addToCart(sku) {
			this.$store.commit('cart/add', { ...sku, quantity: 1 });
			console.log('Add to cart', sku);
		},
	},
};
