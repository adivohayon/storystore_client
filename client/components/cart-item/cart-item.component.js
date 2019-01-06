export default {
	name: 'cart-item',
	components: {},
	async asyncData({ params }) {},
	props: {
		item: {},
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
};
