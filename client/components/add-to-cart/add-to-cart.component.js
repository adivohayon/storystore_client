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
		attributes: {
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
		async addToCart(shelf, attributes) {
			// const sizes = shelf.variations.map(variant => {
			// 	if (variant.attributes.size) {
			// 		return variant.attributes.size;
			// 	}
			// });
			const imageName = this.variant.assets.images[0];
			const image = `https://assets.storystore.co.il/${this.storeSlug}/${
				this.shelf.slug
			}/${this.variant.slug}/${imageName}`;

			const item = {
				...shelf,
				...this.variant,
				quantity: 1,
				image,
				attributes,
				// sizes: removeDuplicates(sizes, 'value'),
			};
			delete item.assets;
			delete item.variations;

			console.log('ADD TO CART', item);

			await this.$store.dispatch('cart/add', {
				item,
				storeSlug: this.storeSlug,
			});
		},
	},
};
