export default {
	name: 'shelf-sale',
	components: {},
	props: {},
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
