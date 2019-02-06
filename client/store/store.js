const useMockData = process.env.USE_MOCK_DATA;
import { removeDuplicates } from '@/helpers/collection.helpers';
import _get from 'lodash/get';
import Vue from 'vue';
export const state = () => ({
	shelves: [],
	// slug: null,
});

export const mutations = {
	add(state, shelf) {
		state.shelves.push(shelf);
	},
	populateShelves(state, shelves) {
		state.shelves = shelves;
	},
	populateStore(state, store) {
		state.storeId = store.storeId;
		state.slug = store.slug;
		state.name = store.name;
		state.shippingDetails = store.shippingDetails;
		state.returnsPolicy = store.returnsPolicy;
	},
};

export const getters = {
	shelfAttributes: () => (variations, attribute) => {
		const atts = variations.map(variant => {
			return _get(variant, ['attributes', attribute]);
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
			const store = useMockData
				? (await import(`@/mocks/${storeSlug}.mock.json`)).default
				: await this.$axios.$get(`stores/${storeSlug}`);

			console.log('store', store.slug);
			if (store) {
				commit('populateShelves', store.shelves);
				commit('populateStore', store);
			}
			// console.log('resp', resp.data);
		} catch (err) {
			console.error('State / Store / Dispatch get / Error', err);
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