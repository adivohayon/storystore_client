import CartItem from '@/components/cart-item';
import '@/icons';
import { getSubdomainFromHost } from '@/helpers/async-data.helpers';
export default {
	components: { CartItem },
	async asyncData({ req, store }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSubdomainFromHost(host);

		store.commit('toggleLoader', false);

		return {
			storeSlug,
		};
	},
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	head() {
		const storeSlug = this.$store.state.store.slug;
		const faviconPath =
			process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;

		return {
			title:
				this.$store.state.store.name + ' - ' + this.$store.state.store.tagline,
			link: [{ rel: 'icon', href: faviconPath }],
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
