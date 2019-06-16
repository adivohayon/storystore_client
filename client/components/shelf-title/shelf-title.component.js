import _get from 'lodash.get';

export default {
	name: 'shelf-title',
	components: {},
	props: {
		price: {
			type: Number,
		},
		currency: {
			type: String,
			default: '₪',
		},
		title: {
			type: String,
		},
		info: {
			type: String,
			default: '',
		},
		shelfType: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			shipping() {
				return _get(this.$store.state, 'store.shippingDetails', '');
			},
			returns() {
				return _get(this.$store.state, 'store.returns', '');
			},
		};
	},
	computed: {
		formatedCurrency() {
			if (this.currency == 'ILS') return '₪';
			if (this.currency == 'USD') return '$';
			if (this.currency == 'EUR') return '€';
			return this.currency;
		},
		textColor() {
			if (this.shelfType === 'ADD_TO_CART') {
				return '#ffffff';
			} else {
				return '#000000';
			}
		},
	},
	created() {},
	mounted() {},
	methods: {
		showShelfInfo() {
			this.$store.commit('toggleShelfInfo');
		},
	},
};
