import _get from 'lodash/get';
export default {
	name: 'page-header',
	components: {},
	async asyncData({}) {},
	props: {},
	data() {
		return {
			// showCart: false,
		};
	},
	mounted() {
		console.log('refs', this.$refs);
		this.$refs.pageHeader.style.setProperty(
			'--page-header-text-color',
			this.textColor
		);
		this.$refs.pageHeader.style.setProperty(
			'--page-header-bg-color',
			this.bgColor
		);
		// this.showCart = true;
	},
	watch: {},
	computed: {
		showCart() {
			return this.$store.state.store.settings.hasCart;
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
		logoSrc() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/${this.storeSlug}_logo.png`;
			return path;
		},
		bgColor() {
			return _get(this.$store.state, 'store.settings.primaryColor', '#ffffff');
		},
		textColor() {
			switch (this.bgColor) {
				case '#000000':
					return '#ffffff';
				case '#ffffff':
					return '#000000';
				default:
					return '#000000';
			}
		},
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
	},
	methods: {},
};
