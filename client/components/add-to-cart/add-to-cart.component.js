import { removeDuplicates } from '@/helpers/collection.helpers';
export default {
	name: 'add-to-cart',
	components: {},
	props: {
		shelf: {
			type: Object,
			default() {
				return {};
			},
		},
		variant: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {};
	},
	computed: {
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	created() {},
	mounted() {
		// console.log('params', this.$route.params);
	},
	methods: {
		async addToCart(shelf) {
			const sizes = shelf.variations.map(variant => {
				if (variant.attributes.size) {
					return variant.attributes.size;
				}
			});

			const image = this.variant.content[0].value;

			const item = {
				...shelf,
				...this.variant,
				quantity: 1,
				image,
				sizes: removeDuplicates(sizes, 'value'),
			};
			delete item.content;
			delete item.variations;

			console.log('ADD TO CART', item);

			await this.$store.dispatch('cart/add', {
				item,
				storeSlug: this.storeSlug,
			});
		},
	},
};
