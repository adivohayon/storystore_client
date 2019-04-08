// import _get from 'lodash/get';
// import Vue from 'vue';
// export const state = () => ({
// 	lastPurchase: {
// 		currency: null,
// 		items: [],
// 		subtotal: 0,
// 		total: 0,
// 		selectedShipping: {},
// 		success: false,
// 		error: false,
// 	},
// });

// export const mutations = {
// 	setLastPurchase(
// 		state,
// 		{ currency, items, subtotal, total, selectedShipping }
// 	) {
// 		Vue.set(state.lastPurchase, 'currency', currency);
// 		Vue.set(state.lastPurchase, 'subtotal', subtotal);
// 		Vue.set(state.lastPurchase, 'total', total);
// 		Vue.set(state.lastPurchase, 'selectedShipping', selectedShipping);
// 		Vue.set(state.lastPurchase, 'items', items);
// 	},

// 	setPurchaseSuccess(state, isSuccess) {
// 		Vue.set(state.lastPurchase, 'success', isSuccess);
// 	},

// 	setPurchaseError(state, isError) {
// 		Vue.set(state.lastPurchase, 'error', isError);
// 	},
// };

// export const getters = {
// 	lastPurchase: state => () => {
// 		return state.lastPurchase;
// 	}
// };
