const useMockData = process.env.USE_MOCK_DATA;
import { removeDuplicates } from '@/helpers/collection.helpers';
import _get from 'lodash/get';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const state = () => ({
	shelves: [],
	pagination: {},
	// slug: null,
});

export const mutations = {
	add(state, shelf) {
		state.shelves.push(shelf);
	},
	populateShelves(state, shelves) {
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

		Vue.set(state, 'shippingDetails', store.shipping_details);
		Vue.set(state, 'info', store.info);
		Vue.set(state, 'about', store.about);
		Vue.set(state, 'tagline', store.tagline);
		Vue.set(state, 'returns', store.returns);
	},
	updateShelfAssetLoaded(
		state,
		{ shelfIndex, variationIndex, assetIndex, loaded }
	) {
		// Vue.set(state, ['shelves'])
		state.shelves[shelfIndex].variations[variationIndex].assets[
			assetIndex
		].loaded = loaded;
	},
	setPagination(state, pagination) {
		Vue.set(state, 'pagination', pagination);
	},
	appendShelves(state, shelves) {
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

			const { shelves, pagination } = await this.$axios.$get(
				`stores/${store.id}/shelves?limit=4`
			);
			// console.log(useMockData, store.shelves);
			// const store = await this.$axios.$get(`stores/${storeSlug}`);
			// console.log('store - usemocks: ' + useMockData, store);
			if (store && shelves && pagination) {
				commit('setPagination', pagination);
				commit('populateShelves', shelves);
				commit('populateStore', store);
				return true;
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
					`stores/${storeId}/shelves?offset=${offset}&limit=7`
				);
				console.log('shelves', shelves);
				const previousShelves = state.shelves;
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
	// async getShelves({ commit }, storeSlug) {
	// 	try {
	// 		console.log('USE_MOCK_DATA', useMockData);
	// 		const shelves = useMockData
	// 			? (await import(`@/mocks/${storeSlug}.mock.json`)).default
	// 			: (await this.$axios.$get(`stores/${storeSlug}/shelves`)).data;

	// 		console.log('resp', shelves);
	// 		commit('populate', shelves);
	// 		// console.log('resp', resp.data);
	// 	} catch (err) {
	// 		console.error('Store / Shelves / Dispatch get / Error', err);
	// 	}
	// },
};
