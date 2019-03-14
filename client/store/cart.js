import _get from 'lodash/get';
import Vue from 'vue';
import { removeDuplicates } from '@/helpers/collection.helpers';
export const state = () => ({
	// added: {},
});

export const mutations = {
	removeItem(state, { itemIndex, storeSlug }) {
		console.log('removed item number', itemIndex);
		state[storeSlug].added.splice(itemIndex, 1);
	},

	addItem(state, { item, storeSlug }) {
		//TODO
		// Update this to allow adding different sizes to the cart
		const cartItemIndex = state[storeSlug].added.findIndex(
			cartItem =>
				cartItem.shelfId === item.shelfId &&
				cartItem.variationId === item.variationId
		);

		if (cartItemIndex > -1) {
			const prevQty = state[storeSlug].added[cartItemIndex].quantity;
			Vue.set(
				state[storeSlug].added[cartItemIndex],
				'quantity',
				prevQty + item.quantity
			);
		} else {
			const items = state[storeSlug].added;
			items.push(item);
			Vue.set(state[storeSlug], 'added', items);
		}
	},

	setItemQuantity(state, { qty, itemId, storeSlug }) {
		const addedIndex = state[storeSlug].added.findIndex(
			addedItem => addedItem.id === itemId
		);
		if (addedIndex > -1) {
			Vue.set(state[storeSlug].added[addedIndex], 'quantity', qty);
		}
	},

	updateItemSize(state, itemIndex, size) {
		state[storeSlug].added[itemIndex].size = size;
	},

	addStore(state, storeSlug) {
		// state[storeSlug] = { added: [] };
		Vue.set(state, storeSlug, {});
		Vue.set(state[storeSlug], 'added', []);
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
		return getters.items(storeSlug).reduce((acc, item) => {
			const itemTotal = item.quantity * item.price;
			return acc + itemTotal;
		}, 0);
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
			if (variant.attrs.size) {
				return variant.attrs.size;
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
