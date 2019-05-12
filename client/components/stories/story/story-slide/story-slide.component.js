export default {
	name: 'story-slide',
	components: {},
	props: {
		variation: {
			type: Object,
			default() {
				return {};
			},
		},
		shelfName: {
			type: String,
		},
		shelfSlug: {
			type: String,
		},
	},
	data() {
		return {};
	},
	computed: {
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}

			path += `${this.shelfSlug}/${this.variation.slug}/`;
			return path;
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
		slideAsset() {
			return this.assetsPath + this.variation.assets[0];
		},
	},
	created() {},
	mounted() {},
	methods: {},
};
