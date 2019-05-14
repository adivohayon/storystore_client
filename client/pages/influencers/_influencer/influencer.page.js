import Stories from '@/components/stories';
import Story from '@/components/stories/story';
import Feed from '@/components/feed';
import _get from 'lodash.get';
import axios from 'axios';
export default {
	components: { Stories, Story, Feed },
	async asyncData({ req, store, params, error }) {
		try {
			const storeId = _get(store.state, 'store.storeId', null);
			if (!storeId) {
				throw new Error('storeId not found');
			}
			const influencer = await store.dispatch('store/getInfluencer', {
				storeId,
				influencerSlug: params.influencer,
			});
			if (!influencer) {
				throw new Error('Influencer not found');
			}
			return {
				influencer,
			};
		} catch (err) {
			console.log(err.toString());
			const message = _get(err, 'response.data', null) || err.toString();
			error({ statusCode: 404, message });
		}
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
		storeSlug() {
			return this.$store.state.store.slug;
		},
		banner() {
			return this.assetsPath + 'banner.png';
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}
			return path;
		},
		stateShelves() {
			return this.$store.state.store.shelves || [];
		},
		// categ() {
		// 	return _get(this.$store.state, 'store.shelves', []);
		// },
	},
	methods: {},
};
