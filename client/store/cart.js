import _get from 'lodash/get';
import Vue from 'vue';
import { removeDuplicates } from '@/helpers/collection.helpers';
import { WooCommerce } from './../services/woocommerce.service';
export const state = () => ({
	// added: {},
});

export const mutations = {
	removeItem(state, { itemIndex, storeSlug }) {
		console.log('removed item number', itemIndex);
		console.log('removeItem - item', state[storeSlug].added[itemIndex]);
		const removedItem = state[storeSlug].added[itemIndex];
		console.log('removeItem - item - key', removedItem.external_cart_key);
		state[storeSlug].added.splice(itemIndex, 1);
		if (this.$integrations.cart) {
			if (
				this.$integrations.cart.connector === 'WOOCOMMERCE' &&
				removedItem.external_cart_key
			) {
				return this.$integrations.cart.service
					.removeFromCart(removedItem.external_cart_key)
					.then(res => {
						console.log('store / cart / removeItem res', res);
					});
			}
		}
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

	updateItemExternalKey(state, { item, storeSlug, externalCartKey }) {
		const cartItemIndex = state[storeSlug].added.findIndex(
			cartItem =>
				cartItem.shelfId === item.shelfId &&
				cartItem.variationId === item.variationId
		);

		if (cartItemIndex > -1) {
			console.log('%%%%% externalItem', externalCartKey);
			Vue.set(
				state[storeSlug].added[cartItemIndex],
				'external_cart_key',
				externalCartKey
			);
		}
	},

	setItemQuantity(state, { qty, itemId, storeSlug }) {
		const addedIndex = state[storeSlug].added.findIndex(
			addedItem => addedItem.variationId === itemId
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
	async add(
		{ commit, state, rootGetters },
		{ item, storeSlug, wooCommerceConnector }
	) {
		return new Promise((resolve, reject) => {
			if (!state[storeSlug]) {
				commit('addStore', storeSlug);
			}
			commit('addItem', { item, storeSlug });

			if (this.$integrations.cart) {
				if (
					this.$integrations.cart.connector === 'WOOCOMMERCE' &&
					item.externalId
				) {
					console.log('ADD TO CART :: cart state');
					return this.$integrations.cart.service
						.addToCart(item.externalId, 1)
						.then(wcItem => {
							commit('updateItemExternalKey', {
								item,
								storeSlug,
								externalCartKey: wcItem.key,
							});
							resolve(wcItem);
						});
					// console.log('wcItem', wcItem);
					// console.log('wcItem KEY', wcItem.key);
					// resolve();
					// return this.$integrations.cart.service.addToCart(item.externalId, 2);
				} else {
					resolve();
				}
			} else {
				resolve();
			}
		});
		// Add item integration
	},

	async remove(
		{ commit, state, rootGetters },
		{ itemIndex, storeSlug, wooCommerceConnector }
	) {
		return new Promise((resolve, reject) => {
			commit('addItem', { itemIndex, storeSlug });
		});
	},

	async get() {
		console.log('this.integrations.cart', this.$integrations.cart);
		if (this.$integrations.cart) {
			return this.$integrations.cart.service.getCart().then(resp => resp.data);
		} else {
			return Promise.resolve();
		}
	},
};

export const getters = {
	integration: (state, getters, rootState) => {
		const integrations = _get(rootState, 'store.settings.integrations', []);
		return (
			integrations.find(integration => integration.type === 'CART') || null
		);
	},
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
