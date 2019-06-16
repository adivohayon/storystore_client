export const props = {
	shelf: {
		type: Object,
		default() {
			return {};
		},
	},
	variation: {
		type: Object,
		default() {
			return {};
		},
	},
	variationAttribute: {
		type: Number,
	},
	selectedAttributes: {
		type: Object,
		default() {
			return {};
		},
	},
	selectedProperty: {
		type: Object,
		default() {
			return {};
		},
	},
	showGoToPayment: {
		type: Boolean,
		default: false,
	},
};
