import Stories from '@/components/stories';
import Story from '@/components/stories/story';
import _get from 'lodash.get';
import axios from 'axios';
export default {
	components: { Stories, Story },
	async asyncData({ req, store, params }) {
		const categories = await store.dispatch(
			'store/getCategories',
			params.category
		);

		return {
			categories,
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
		// categ() {
		// 	return _get(this.$store.state, 'store.shelves', []);
		// },
	},
	methods: {},
};
