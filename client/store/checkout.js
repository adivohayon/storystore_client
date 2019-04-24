import _get from 'lodash/get';
import Vue from 'vue';

export const state = () => ({
	shippingOption: {},
	shippingDetails: {
		city: null,
		street: null,
		houseNumber: null,
		apptNumber: null,
		floor: null,
		// zipCode: null,
		submitStatus: null,
	},
	personal: {
		firstName: null,
		lastName: null,
		phone: null,
		email: null,
	},
	lastPurchase: {},
});

export const mutations = {
	setShippingOption(state, shippingOption) {
		Vue.set(state, 'shippingOption', shippingOption);
	},
	setShippingDetails(state, shippingDetails) {
		Vue.set(state, 'shippingDetails', shippingDetails);
	},
	setPersonalDetails(state, personal) {
		Vue.set(state, 'personal', personal);
	},
	setLastPurchase(state, purchase) {
		Vue.set(state, 'lastPurchase', purchase);
	},
};
export const actions = {
	checkout({ rootGetters, state, commit }, storeSlug) {
		return new Promise(async (resolve, reject) => {
			try {
				const customer = {
					first_name: state.personal.firstName,
					last_name: state.personal.lastName,
					phone: state.personal.phone,
					email: state.personal.email,
					shipping_address: `${state.shippingDetails.street} ${
						state.shippingDetails.houseNumber
					} ${state.shippingDetails.apptNumber} ${state.shippingDetails.floor}`,
					shipping_city: state.shippingDetails.city,
					// shipping_zip_code: this.order.zipCode,
				};

				const items = rootGetters['cart/items'](storeSlug);
				const itemsPayload = items.map(item => {
					return {
						variationId: item.variationId,
						variationAttributeIds: item.variationAttributeIds,
						qty: item.quantity,
					};
				});
				// return;
				const shippingPayload = state.shippingOption;

				shippingPayload.id = -1;
				const resp = await this.$axios.$post(`order`, {
					customer,
					items: itemsPayload,
					shipping: shippingPayload,
				});

				if (!resp.url || resp.url === '') {
					reject('URL returned from API is empty');
				}

				const subtotal = rootGetters['cart/subtotal'](storeSlug);
				const total =
					shippingPayload && shippingPayload.price >= 0
						? subtotal + shippingPayload.price
						: subtotal;

				const currency =
					items.length > 0
						? _get(items[0], 'variations[0].currency', 'ILS')
						: 'ILS';

				const purchase = {
					currency,
					items,
					subtotal,
					total,
					selectedShipping: shippingPayload,
				};
				commit('setLastPurchase', purchase);

				resolve(resp.url);
			} catch (err) {
				reject(err);
			}
		});
	},
};
