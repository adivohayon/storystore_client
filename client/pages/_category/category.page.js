import Stories from '@/components/stories';
import Story from '@/components/stories/story';
import Feed from '@/components/feed';
import _get from 'lodash.get';
import axios from 'axios';
import { pageHeadMixin } from '@/helpers/mixins';
export default {
	components: { Stories, Story, Feed },
	async asyncData({ req, store, params }) {
		const storeId = _get(store, 'state.store.storeId', null);
		let resp;
		if (storeId) {
			resp = await store.dispatch('store/getCategories', {
				categorySlug: params.category,
				storeId,
			});
		}

		const { firstCategory, subCategories, restOfCategories } = resp;

		firstCategory.shelves = [];

		const shelves = _get(store, 'state.store.shelves', []);
		for (const shelf of shelves) {
			const categoryIds = shelf.Categories.map(category => category.id);

			// if shelf category ids are included in first category, add them
			if (categoryIds.includes(firstCategory.id)) {
				firstCategory.shelves.push(shelf);
			}

			for (let i = 0; i < subCategories.length; i++) {
				if (categoryIds.includes(subCategories[i].id)) {
					if (subCategories[i].shelves) {
						subCategories[i].shelves.push(shelf);
					} else {
						subCategories[i].shelves = [shelf];
					}
				}
			}

			for (let i = 0; i < restOfCategories.length; i++) {
				if (categoryIds.includes(restOfCategories[i].id)) {
					if (restOfCategories[i].shelves) {
						restOfCategories[i].shelves.push(shelf);
					} else {
						restOfCategories[i].shelves = [shelf];
					}
				}
			}
		}

		return {
			firstCategory,
			subCategories,
			restOfCategories,
		};
	},
	mixins: [pageHeadMixin],
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	data() {
		return {};
	},
	async mounted() {
		try {
			this.handleCartIntegration();
		} catch (err) {
			console.error('Category Page / created() / Error', err);
		}
	},
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
		cartIntegration() {
			return this.$store.getters['cart/integration'];
		},
		// categ() {
		// 	return _get(this.$store.state, 'store.shelves', []);
		// },
	},
	methods: {
		async handleCartIntegration() {
			try {
				const cart = await this.$store.dispatch('cart/get');
				console.log('cart', cart);
			} catch (err) {
				console.error('Category Page / handleCartIntegration / Error', err);
			}
		},
	},
};
