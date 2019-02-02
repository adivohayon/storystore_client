import _get from 'lodash/get';
import { removeDuplicates } from '@/helpers/collection.helpers';
export const state = () => ({
	// added: {},
});

export const mutations = {
	remove(state, itemIndex) {
		console.log('removed item number', itemIndex);
		state.added.splice(itemIndex, 1);
	},

	addItem(state, { item, storeSlug }) {
		const addedIndex = state[storeSlug].added.findIndex(
			addedItem => addedItem.sku === item.sku
		);

		console.log('addedIndex', addedIndex);

		if (addedIndex > -1) {
			state[storeSlug].added[addedIndex].quantity += item.quantity;
		} else {
			state[storeSlug].added.push(item);
		}
	},

	addStore(state, storeSlug) {
		state[storeSlug] = { added: [] };
	},
};

export const actions = {
	async add({ commit, state }, { item, storeSlug }) {
		if (!state[storeSlug]) {
			commit('addStore', storeSlug);
		}
		commit('addItem', { item, storeSlug });
	},
};

export const getters = {
	subtotal: (state, getters) => storeSlug => {
		return getters
			.items(storeSlug)
			.reduce((acc, item) => {
				const itemTotal = item.quantity * item.price;
				return acc + itemTotal;
			}, 0)
			.toFixed(2);
	},
	itemsCount: (state, getters) => storeSlug => {
		return getters.items(storeSlug).reduce((acc, item) => {
			const itemCount = item.quantity;
			return acc + itemCount;
		}, 0);
	},
	availableSizes: state => (storeSlug, itemIndex) => {
		console.log('storeSlug', storeSlug);
		const variations = _get(
			state,
			[storeSlug, 'added', itemIndex, 'variations'],
			[]
		);

		const sizes = variations.map(variant => {
			if (variant.attributes.size) {
				return variant.attributes.size;
			}
		});

		return removeDuplicates(sizes, 'value');
	},

	items: state => storeSlug => {
		return _get(state, [storeSlug, 'added'], []);
	},
	// items(state) => (storeSlug) => {

	// },
};
