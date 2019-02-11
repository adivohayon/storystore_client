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
		itemQuantity: {
			get() {
				return this.item.quantity;
			},
			set(qty) {
				this.$store.commit('cart/setItemQuantity', {
					qty,
					itemId: this.item.id,
					storeSlug: this.storeSlug,
				});
			},
		},
	},
	methods: {
		removeItem() {
			console.log('removeItem');
			this.$store.commit('cart/removeItem', {
				itemIndex: this.itemIndex,
				storeSlug: this.storeSlug,
			});
			// document.getElementById(`remove_${this.itemIndex}`).style.display =
			// 	'none';
		},
	},
};
