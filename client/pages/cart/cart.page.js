import CartItem from '@/components/cart-item';
import '@/icons';
export default {
	components: { CartItem },
	async asyncData({ params }) {},
	data() {
		return {};
	},
	mounted() {},
	computed: {
		storeSlug() {
			return this.$route.params.storeSlug || null;
			// this.$route
		},
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		itemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
	},
	methods: {},
};
