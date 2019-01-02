import CartItem from '../../components/cart-item';

export default {
	components: { CartItem },
	async asyncData({ params }) {},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		items() {
			return this.$store.getters['cart/items'];
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'];
		},
	},
	methods: {
		back() {
			this.$router.push('/');
		},
	},
};
