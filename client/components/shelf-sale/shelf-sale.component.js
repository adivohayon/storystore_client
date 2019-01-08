export default {
	name: 'shelf-sale',
	components: {},
	props: {
		shelfSale: {
			type: Object,
		},
	},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		closeSale() {
			console.log('closeSale');
			this.$emit('close-sale');
		},
	},
};
