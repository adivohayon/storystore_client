import Stories from '@/components/stories';
import Story from '@/components/stories/story';
import Feed from '@/components/feed';
import ShelfInfo from '@/components/shelf-info';
import _get from 'lodash.get';
import axios from 'axios';
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	components: { Stories, Story, Feed, ShelfInfo },
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
	mixins: [pageHeadMixin],
	// head() {
	// 	const storeSlug = this.$store.state.store.slug;
	// 	const faviconPath =
	// 		process.env.staticDir + storeSlug + `/${storeSlug}_favicon.png`;

	// 	return {
	// 		title:
	// 			this.$store.state.store.name + ' - ' + this.$store.state.store.tagline,
	// 		link: [{ rel: 'icon', href: faviconPath }],
	// 	};
	// },
	data() {
		return {
			currentStoryIndex: 0,
			brandWebsiteUrl: 'https://www.hoodies.co.il/hoodies-pro/',
		};
	},
	mounted() {},
	computed: {
		storeSlug() {
			return this.$store.state.store.slug;
		},
		banner() {
			return this.assetsPath + 'banner.jpg';
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
		autostartStories() {
			return _get(this.$store.state, 'store.settings.stories.autostart', false);
		},
		storiesStarted() {
			return (
				this.autostartStories &&
				_get(this.$store.state, 'store.settings.stories.started', false)
			);
		},
		showShelfInfo() {
			return this.$store.state.showShelfInfo;
		},
		shelfInfo() {
			// return this.$store.state.store.shelves[this.currentStoryIndex].info;
			return _get(
				this.influencer,
				`shelves[${this.currentStoryIndex}].info`,
				null
			);
		},
		shippingDetails() {
			return this.$store.state.store.shippingDetails;
		},
		returns() {
			return this.$store.state.store.returns;
		},
	},
	methods: {
		toggleStoryStarted() {
			console.log('aaaa');
			setTimeout(() => {
				this.$store.commit('store/updateStoryStarted', true);
			}, 2300);
		},
		setStoryIndex(index) {
			this.currentStoryIndex = index;
		},
		goToBrandWebsite() {
			window.location.href = this.brandWebsiteUrl;
		},
	},
};
