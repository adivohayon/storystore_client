export default {
	name: 'cart-item',
	components: {},
	async asyncData({ params }) {},
	props: {
		item: {},
		itemIndex: Number,
	},
	data() {
		return {};
	},
	mounted() {
		this.test = this.sizes;
	},
	computed: {
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	methods: {
		swipeHandlerRight() {
			document.getElementById(`remove_${this.itemIndex}`).style.display =
				'flex';
			console.log('detected swipe right on element number:' + this.itemIndex);
		},
		swipeHandlerLeft() {
			document.getElementById(`remove_${this.itemIndex}`).style.display =
				'none';
			console.log('detected swipe left on element number:' + this.itemIndex);
		},
		removeItem() {
			this.$store.commit('cart/remove', this.itemIndex);
			document.getElementById(`remove_${this.itemIndex}`).style.display =
				'none';
		},
	},
};
