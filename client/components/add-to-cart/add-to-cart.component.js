import { throws } from 'assert';

export default {
	name: 'add-to-cart',
	components: {},
	props: {},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		addToCart() {
			// adding to persist cart state.
			this.$router.push('/cart');
		},
	},
};
