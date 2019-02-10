export default {
	components: {},
	async asyncData({ params }) {},
	data() {
		return {
			storeName: null,
			checkoutForm: {
				firstName: null,
				lastName: null,
				phone: null,
				email: null,
				city: null,
				street: null,
				houseNumber: null,
				apptNumber: null,
				floor: null,
				zipCode: null,
			},
		};
	},
	mounted() {
		this.storeName = this.$route.params.storeSlug;
	},
	computed: {
		// storeSlug() {
		// 	console.log('params**', this.$route.params);
		// 	return this.$route.params.storeSlug || null;
		// },
		// items() {
		// 	return this.$store.getters['cart/items'](this.storeSlug);
		// },
		// subtotal() {
		// 	return this.$store.getters['cart/subtotal'].toFixed(2);
		// },
		// itemsCount() {
		// 	return this.$store.getters['cart/itemsCount'];
		// },
	},
	methods: {},
};
