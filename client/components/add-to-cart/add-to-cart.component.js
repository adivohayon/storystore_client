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
		selectedAttributes: {
			type: Object,
			default() {
				return {};
			},
		},
		selectedProperty: {
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
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/${this.shelf.slug}/${this.variant.slug}/`;
			}

			return path;
		},
	},
	created() {},
	mounted() {
		// console.log('params', this.$route.params);
	},
	methods: {
		async addToCart(shelf, selectedAttributes, selectedProperty) {
			setTimeout(function() {
				let el = document.querySelector(':focus');
				if (el) el.blur();
			}, 300);
			// const sizes = shelf.variations.map(variant => {
			// 	if (variant.attributes.size) {
			// 		return variant.attributes.size;
			// 	}
			// });
			const imageName = this.variant.assets[0];
			const image = this.assetsPath + imageName;
			// const image = `https://assets.storystore.co.il/${this.storeSlug}/${
			// 	this.shelf.slug
			// }/${this.variant.slug}/${imageName}`;

			const item = {
				shelfId: shelf.id,
				name: shelf.name,
				shelfSlug: shelf.slug,
				currency: this.variant.currency,
				price: this.variant.price,
				sale_price: this.variant.sale_price,
				variationId: this.variant.id,
				variationSlug: this.variant.slug,
				quantity: 1,
				image,
				attributes: { ...selectedAttributes, ...selectedProperty },
				// sizes: removeDuplicates(sizes, 'value'),
			};
			delete item.assets;
			delete item.variations;

			console.log('ADD TO CART', item);

			await this.$store.dispatch('cart/add', {
				item,
				storeSlug: this.storeSlug,
			});

			// console.log('this.ga', this.$ga);
			item.storeSlug = this.storeSlug;

			this.$ga.event({
				eventCategory: 'category',
				eventAction: 'add-to-cart',
				eventLabel: 'item',
				eventValue: JSON.stringify(item),
			});
		},
	},
};
