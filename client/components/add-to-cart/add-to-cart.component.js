import { removeDuplicates } from '@/helpers/collection.helpers';
export default {
	name: 'add-to-cart',
	components: {},
	props: {
		variationAttribute: {
			type: Number,
		},
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
		showGoToPayment: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {};
	},
	computed: {
		shelfGoal() {
			if (this.storeSlug === 'oz-nadlan') {
				return 'CONTACT';
			} else {
				return 'PURCHASE';
			}
		},
		buttonText() {
			return this.shelf.cta_text || 'הוספה לסל';
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}

			return path;
		},
	},
	created() {},
	mounted() {
		// console.log('params', this.$route.params);
	},
	methods: {
		ctaClick(shelf) {
			switch (shelf.type) {
				case 'ADD_TO_CART':
					this.addToCart(shelf, this.selectedAttributes, this.selectedProperty);
					break;
				case 'SCROLL_TO':
					break;
				case 'LINK':
					const shelfLink = shelf.data.url;
					this.goToLink(shelfLink);
					break;
			}
		},
		goToLink(url) {
			const win = window.open(url, '_blank');
			win.focus();
		},
		async addToCart(shelf, selectedAttributes, selectedProperty) {
			if (this.shelfGoal === 'CONTACT') {
				return;
			}

			if (this.showGoToPayment) {
				this.$router.replace('/checkout/shipping-options');
				return;
			}

			setTimeout(function() {
				let el = document.querySelector(':focus');
				if (el) el.blur();
			}, 300);
			// const sizes = shelf.variations.map(variant => {
			// 	if (variant.attributes.size) {
			// 		return variant.attributes.size;
			// 	}
			// });
			const imageName = this.variant.assets[0].src;
			const image = this.assetsPath + imageName;
			// const image = `https://assets.storystore.co.il/${this.storeSlug}/${
			// 	this.shelf.slug
			// }/${this.variant.slug}/${imageName}`;
			const variationAttributeIds = [];
			for (const attributeKey in selectedAttributes) {
				if (
					selectedAttributes.hasOwnProperty(attributeKey) &&
					selectedAttributes[attributeKey].variationAttributeId
				) {
					variationAttributeIds.push(
						selectedAttributes[attributeKey].variationAttributeId
					);
				}
			}
			const item = {
				shelfId: shelf.id,
				name: shelf.name,
				shelfSlug: shelf.slug,
				currency: this.variant.currency,
				price: this.variant.price,
				sale_price: this.variant.sale_price,
				variationId: this.variant.variationId,
				variationSlug: this.variant.slug,
				quantity: 1,
				image,
				variationAttributeIds,
				// variationAttributeId: this.variant
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

			if (typeof fbq !== 'undefined' && fbq) {
				fbq('track', 'AddToCart', {
					content_name: `${this.shelf.name} - ${this.variant.property_label}`,
					content_category: this.storeSlug,
					content_ids: [this.variant.variationId],
					content_type: 'product',
					value: this.variant.finalPrice,
					currency: this.variant.currency,
				});
			}
			// console.log('this.ga', this.$ga);
			item.storeSlug = this.storeSlug;
			this.$emit('setGoToPayment');
			// this.added = true;
			// this.$ga.event({
			// 	eventCategory: 'category',
			// 	eventAction: 'add-to-cart',
			// 	eventLabel: 'item',
			// 	eventValue: JSON.stringify(item),
			// });
		},
	},
};
