export default {
	name: 'page-header',
	components: {},
	async asyncData({}) {},
	props: {},
	data() {
		return {};
	},
	mounted() {
		this.test = this.sizes;
	},
	computed: {
		storeSlug() {
			return this.$store.state.store.slug;
		},
		logoSrc() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/${this.storeSlug}_logo.png`;
			return path;
		},
	},
	methods: {},
};
