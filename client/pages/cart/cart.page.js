import CartItem from '../../components/cart-item';

export default {
	components: { CartItem },
	async asyncData({ params }) {},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		itemsList() {
			return this.$store.getters.items;
		},
		subtotal() {
			return this.$store.getters.subtotal;
		},
	},
	methods: {
		back() {
			this.$router.push('/');
		},
	},
};
