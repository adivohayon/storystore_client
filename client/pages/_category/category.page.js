import Stories from '@/components/stories';
import Story from '@/components/stories/story';
import ShelfInfo from '@/components/shelf-info';
import Feed from '@/components/feed';
import _get from 'lodash.get';
import _sortBy from 'lodash.sortby';
import axios from 'axios';
import { pageHeadMixin } from '@/helpers/mixins';

export default {
	components: { Stories, Story, ShelfInfo },
	async asyncData({ req, store, params, $axios }) {
		const storeId = _get(store, 'state.store.storeId', null);
		console.log('yooooo', params);
		let endpointUrl = params.category
			? `stores/${storeId}/categories/${encodeURI(params.category)}`
			: `stores/${storeId}/categories/null`;

		const {
			firstCategory,
			subCategories,
			restOfCategories,
		} = await $axios.$get(endpointUrl);

		firstCategory.shelves = [];

		// ADDS SHELVES TO CATEGORIES
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
			subCategories: _sortBy(
				subCategories,
				category => category.shelves.length
			).reverse(),
			restOfCategories: _sortBy(
				restOfCategories,
				category => category.shelves.length
			).reverse(),
		};
	},
	mixins: [pageHeadMixin],
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	data() {
		return {
			currentStoryIndex: 0,
		};
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
		shelfInfo() {
			// return this.$store.state.store.shelves[this.currentStoryIndex].info;
			return _get(this.$store.state, `store.shelfInfo`, null);
		},
		shippingDetails() {
			return this.$store.state.store.shippingDetails;
		},
		returns() {
			return this.$store.state.store.returns;
		},
		showShelfInfo() {
			return this.$store.state.showShelfInfo;
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
		setStoryIndex(index) {
			this.currentStoryIndex = index;
		},
	},
};
