export const state = () => ({
	added: [],
});

export const mutations = {
	add(state, { item }) {
		console.log('item', item.quantity);
		const addedIndex = state.added.findIndex(
			addedItem => addedItem.sku === item.sku
		);

		console.log('addedIndex', addedIndex);
		if (addedIndex > -1) {
			state.added[addedIndex].quantity += item.quantity;
		} else {
			state.added.push(item);
		}
	},

	remove(state, itemIndex) {
		state.added.splice(itemIndex, 1);
	},
};

export const getters = {
	subtotal(state) {
		return state.added.reduce((acc, item) => {
			const itemTotal = item.quantity * item.size.price;
			return acc + itemTotal;
		}, 0);
	},
	items(state) {
		return state.added;
	},
};
