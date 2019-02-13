export default {
	name: 'shelf-title',
	components: {},
	props: {
		price: {
			type: String,
		},
		currency: {
			type: String,
			default: '₪',
		},
		title: {
			type: String,
		},
	},
	data() {
		return {};
	},
	computed: {
		formatedCurrency() {
			if (this.currency == 'ILS') return '₪';
			if (this.currency == 'USD') return '$';
			if (this.currency == 'EUR') return '€';
			return this.currency;
		},
	},
	created() {},
	mounted() {},
	methods: {},
};
