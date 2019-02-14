import CartItem from '@/components/cart-item';
import '@/icons';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
export default {
	components: { CartItem },
	async asyncData({ req }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSlugFromHost(host);

		return {
			storeSlug,
		};
	},
	data() {
		return {};
	},
	mounted() {},
	computed: {
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
