export default {
	name: 'cart-item',
	components: {},
	async asyncData({ params }) {},
	props: {
		item: {},
		itemIndex: Number,
	},
	data() {
		return {
			colors: [
				{ content: 'nu', desc: 'blyat' },
				{ content: 'Cleveland Cavaliers', desc: '克里夫兰骑士' },
			],
			test: [],
		};
	},
	mounted() {
		this.test = this.sizes;
	},
	computed: {
		itemImage() {
			return this.item.variations.colors.find(color => {
				return color.label === this.item.color.label;
			}).image;
		},
		sizes() {
			return this.item.variations.sizes.map((size, sizeIndex) => {
				return {
					desc: sizeIndex,
					content: size,
				};
			});
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
