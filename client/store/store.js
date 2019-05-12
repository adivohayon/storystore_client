const useMockData = process.env.USE_MOCK_DATA;
import { removeDuplicates } from '@/helpers/collection.helpers';
import _get from 'lodash/get';
import Vue from 'vue';
import Vuex from 'vuex';
import _orderBy from 'lodash.orderby';
Vue.use(Vuex);

export const state = () => ({
	shelves: [],
	pagination: {},
	settings: {},
	// feedComponent: {},
	// slug: null,
});

export const mutations = {
	// setFeedComponent(state, feedComponent) {
	// 	Vue.set(state, 'feedComponent', feedComponent);
	// },
	updateSettings(state, { key, value }) {
		Vue.set(state.settings, key, value);
	},
	add(state, shelf) {
		state.shelves.push(shelf);
	},
	populateShelves(state, shelves) {
		for (const shelf of shelves) {
			shelf.variations = _orderBy(
				shelf.variations,
				['variation_order'],
				['asc']
			);
		}

		Vue.set(state, 'shelves', shelves);
	},
	populateStore(state, store) {
		Vue.set(state, 'storeId', store.id);
		Vue.set(state, 'slug', store.slug);
		Vue.set(state, 'name', store.name);

		if (store.shipping_options) {
			const shippingOptions = store.shipping_options.sort((obj1, obj2) => {
				return obj1.price - obj2.price;
			});
			Vue.set(state, 'shippingOptions', shippingOptions);
		}
		// console.log('returns', store.returns);
		Vue.set(state, 'shippingDetails', store.shipping_details);
		Vue.set(state, 'info', store.info);
		Vue.set(state, 'about', store.about);
		Vue.set(state, 'tagline', store.tagline);
		Vue.set(state, 'settings', store.settings);
		Vue.set(state, 'returns', store.returns);
	},
	updateShelfAssetLoaded(
		state,
		{ shelfIndex, variationIndex, assetIndex, loaded }
	) {
		// Vue.set(state, ['shelves'])
		if (state.shelves[shelfIndex]) {
			state.shelves[shelfIndex].variations[variationIndex].assets[
				assetIndex
			].loaded = loaded;
		}
	},
	setPagination(state, pagination) {
		Vue.set(state, 'pagination', pagination);
	},
	appendShelves(state, shelves) {
		for (const shelf of shelves) {
			shelf.variations = _orderBy(
				shelf.variations,
				['variation_order'],
				['asc']
			);
		}
		state.shelves.push(...shelves);
	},
};

export const getters = {
	shelfAttributes: () => (variations, attribute) => {
		const atts = variations.map(variant => {
			return _get(variant, ['attrs', attribute]);
		});

		return atts.length ? removeDuplicates(atts, 'value') : [];
	},
	currency: state => {
		return _get(state.shelves[0].variations[0].currency);
	},

	// shelfSizes: () => variations => {
	// 	const sizes = variations.map(variant => {
	// 		if (variant.attributes.size) {
	// 			return variant.attributes.size;
	// 		}
	// 	});

	// 	return sizes.length ? removeDuplicates(sizes, 'value') : [];
	// },

	// shelfColors: () => variations => {

	// }
};

export const actions = {
	async get({ commit }, storeSlug) {
		try {
			let store;
			if (useMockData == 'true') {
				store = (await import(`@/mocks/${storeSlug}.mock.json`)).default;
			} else {
				store = await this.$axios.$get(`stores/${storeSlug}`);
			}
			// console.log('store', store);
			if (store && store.id) {
				let limit = 5;
				if (storeSlug === 'stores') {
					limit = 15;
				}
				const { shelves, pagination } = await this.$axios.$get(
					`stores/${store.id}/shelves?limit=${limit}`
				);
				// console.log(useMockData, store.shelves);
				// const store = await this.$axios.$get(`stores/${storeSlug}`);
				// console.log('store - usemocks: ' + useMockData, store);
				// console.log('stores', store);
				if (shelves && pagination) {
					commit('setPagination', pagination);
					commit('populateShelves', shelves);
					commit('populateStore', store);
					return true;
				}
			}
			return false;
			// console.log('resp', resp.data);
		} catch (err) {
			console.error('State / Store / Dispatch get / Error', err);
			return false;
		}
	},
	getShelves({ state, commit }, { storeId, offset }) {
		return new Promise(async (resolve, reject) => {
			try {
				const { shelves, pagination } = await this.$axios.$get(
					`stores/${storeId}/shelves?offset=${offset}&limit=5`
				);
				console.log('shelves', shelves);
				// const previousShelves = state.shelves;
				if (shelves && pagination) {
					commit('setPagination', pagination);
					commit('appendShelves', shelves);
				}
				resolve();
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
	},
	assetLoaded(asset) {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = this.assetsPath + asset.src;
			image.onload = e => {
				this.$store.commit('store/updateShelfAssetLoaded', {
					shelfIndex: asset.shelfIndex,
					variationIndex: 0,
					assetIndex: asset.index,
					loaded: true,
				});
				resolve(e);
			};
		});
	},
	getCategories({}, categorySlug) {
		return new Promise(async (resolve, reject) => {
			try {
				const categories = await this.$axios.$get(
					`stores/1/categories/${categorySlug}`
				);
				resolve(categories);
			} catch (err) {
				console.error(err);
				reject(err);
			}
		});
		// return
	},
};
