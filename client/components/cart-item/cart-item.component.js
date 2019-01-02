export default {
	name: 'cart-item',
	components: {},
	async asyncData({ params }) {},
	props: {
		price: {
			type: Number,
		},
		size: {
			type: String,
		},
		productName: {
			type: String,
		},
	},
	data() {
		return {};
	},
	mounted() {
		// const el = document.querySelector('#shelf-1');
		// console.log('elll', el);
	},
	computed() {},
};
