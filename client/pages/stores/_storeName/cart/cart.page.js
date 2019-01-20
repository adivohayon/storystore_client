import CartItem from '@/components/cart-item';
import '@/icons';
export default {
	components: { CartItem },
	async asyncData({ params }) {},
	data() {
		return {
			storeName: null,
		};
	},
	mounted() {
		this.storeName = this.$route.params.storeName;
	},
	computed: {
		items() {
			return this.$store.getters['cart/items'];
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'].toFixed(2);
		},
		itemsCount() {
			return this.$store.getters['cart/itemsCount'];
		},
	},
	methods: {},
};
