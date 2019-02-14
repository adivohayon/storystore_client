const useMockData = process.env.USE_MOCK_DATA;
import { removeDuplicates } from '@/helpers/collection.helpers';
import _get from 'lodash/get';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const state = () => ({
	shelves: [],
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
		Vue.set(state, 'shippingDetails', store.shipping_details);
		Vue.set(state, 'info', store.info);
		Vue.set(state, 'about', store.about);
		Vue.set(state, 'tagline', store.tagline);
		Vue.set(state, 'returns', store.returns);
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

			// console.log(useMockData, store.shelves);
			// const store = await this.$axios.$get(`stores/${storeSlug}`);
			// console.log('store - usemocks: ' + useMockData, store);
			if (store) {
				commit('populateShelves', store.shelves);
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
