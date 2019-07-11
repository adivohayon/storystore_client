import { removeDuplicates } from '@/helpers/collection.helpers';
import { hoodies } from '@/mixins/hoodies.js';
import _get from 'lodash.get';
export default {
	name: 'add-to-cart',
	mixins: [hoodies],
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
		// showButton: true,
	},
	data() {
		return {};
	},
	computed: {
		bgColor() {
			return _get(this.$store.state, 'store.settings.ctaColor', '#ffffff');
		},
		textColor() {
			return this.bgColor === '#ffffff' ? '#000000' : '#ffffff';
		},
		shelfGoal() {
			if (this.storeSlug === 'oz-nadlan') {
				return 'CONTACT';
			} else {
				return 'PURCHASE';
			}
		},
		buttonText() {
			if (this.showGoToPayment) {
				return 'לתשלום';
			} else {
				return this.shelf.cta_text || 'הוספה לסל';
			}
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			console.log('add-to-cart / assetsPath', path);
			if (process.env.staticDir) {
				// path += `${this.storeSlug}/${this.shelf.slug}/`;
				path += `${this.storeSlug}/`;
			}

			if (this.$nuxt.$route.name === 'category') {
				path += this.shelf.slug + '/' + this.variant.slug + '/';
			}
			return path;
		},
		userSelectedSize() {
			return (
				this.selectedAttributes['fashion_simple_size'] &&
				Object.keys(this.selectedAttributes['fashion_simple_size']).length > 0
			);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		externalId() {
			return Number(
				_get(this.variant, 'attributes[0].variationAttribute.external_id', null)
			);
		},
		// hoodiesCustom() {
		// 	const integrationType = _get(
		// 		this.$store.state,
		// 		'store.settings.integrations.type',
		// 		null
		// 	);
		// 	console.log('cart page / hoodiesCustom', integrationType);
		// 	if (integrationType && integrationType === 'HOODIES_CUSTOM') {
		// 		return true;
		// 	}
		// },
	},
	created() {},
	mounted() {
		// console.log('params', this.$route.params);
	},
	methods: {
		ctaClick(shelf) {
			console.log('Add to cart / ctaClick / Shelf Type', shelf.type);
			switch (shelf.type) {
				case 'ADD_TO_CART':
					console.log('this.userSelectedSize', this.userSelectedSize);

					if (!this.selectedAttributes.no_attribute && !this.userSelectedSize) {
						this.$emit('select-size-error');
					} else {
						this.addToCart(
							shelf,
							this.selectedAttributes,
							this.selectedProperty
						);
					}
					break;
				case 'SCROLL_TO':
					// const
					console.log('scrollTo', scrollTo);
					let scrollTo = 0;
					if (shelf.data.scrollTo && shelf.data.scrollTo === 'LAST_SHELF') {
						scrollTo = _get(this.$store.state, 'store.shelves', []).length - 1;
					}
					this.$emit('scrollTo', scrollTo);
					break;
				case 'LINK':
					const shelfLink = shelf.data.url;
					this.goToLink(shelfLink);
					break;
				case 'CONTACT_FORM':
					this.$emit('cta-clicked');
			}
		},
		goToLink(url) {
			const win = window.open(url, '_blank');
			win.focus();
		},
		addToCartImage() {
			let image = this.assetsPath;
			// Regular shelf
			if (this.variant.assets[0].src) {
				image += this.variant.assets[0].src;
			} else {
				// Story shelf - or non-lazyloaded shelf
				if (this.variant.assets[0]) {
					image += `${this.shelf.slug}/${this.variant.slug}/${
						this.variant.assets[0]
					}`;
				}
			}
			return image;
		},
		addToCartVariationAttributeIds() {
			const variationAttributeIds = [];
			for (const attributeKey in this.selectedAttributes) {
				if (
					this.selectedAttributes.hasOwnProperty(attributeKey) &&
					this.selectedAttributes[attributeKey].variationAttributeId
				) {
					variationAttributeIds.push(
						this.selectedAttributes[attributeKey].variationAttributeId
					);
				}
			}
			return variationAttributeIds;
		},
		addToCartItem(image, variationAttributeIds, attrs) {
			console.log('attt');

			const item = {
				shelfId: this.shelf.id,
				name: this.shelf.name,
				shelfSlug: this.shelf.slug,
				currency: this.variant.currency,
				price: this.variant.price,
				sale_price: this.variant.sale_price,
				variationId: this.variant.variationId,
				variationSlug: this.variant.slug,
				quantity: 1,
				externalId: this.externalId,
				image,
				variationAttributeIds,
				attributes: attrs,
			};
			delete item.assets;
			delete item.variations;

			console.log('ADD TO CART', item);
			return item;
		},
		handleShowGoToPayment() {
			if (this.showGoToPayment) {
				if (this.hoodiesCustom) {
					this.$store.dispatch('toggleLoader', true);
					this.$analytics.goToCheckout(this.subtotal);
					this.goToHoodiesCheckout();
					return true;
				} else {
					this.$analytics.goToCheckout(this.subtotal);
					this.$router.replace('/checkout/shipping-options');
					return true;
				}
			} else {
				return false;
			}
		},
		async addToCart(shelf, selectedAttributes, selectedProperty) {
			try {
				if (this.handleShowGoToPayment()) {
					return;
				}

				setTimeout(function() {
					let el = document.querySelector(':focus');
					if (el) el.blur();
				}, 300);

				const image = this.addToCartImage();
				const variationAttributeIds = this.addToCartVariationAttributeIds();
				const attributes = { ...selectedAttributes, ...selectedProperty };
				const item = this.addToCartItem(
					image,
					variationAttributeIds,
					attributes
				);

				await this.$store.dispatch('cart/add', {
					item,
					storeSlug: this.storeSlug,
				});
				this.$emit('setGoToPayment');
				this.$analytics.addToCart(item.shelfSlug, item.variationSlug);

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
			} catch (err) {
				console.error('add-to-cart.component / addToCart / Error', err);
			}

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
