import _get from 'lodash.get';
import { props } from './../cta.component.props';
import { hoodies } from '@/mixins/hoodies.js';
export default {
	name: 'add-to-cart-cta',
	mixins: [hoodies],
	components: {},
	props,
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
				path += this.shelf.slug + '/' + this.variation.slug + '/';
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
		cartIntegration() {
			const integrations = _get(
				this.$store.state,
				'store.settings.integrations',
				[]
			);
			const cartIntegration = integrations.find(
				integration => integration.type === 'cart'
			);
			return cartIntegration;
		},
		ctaText() {
			if (this.showGoToPayment) {
				return 'לתשלום';
			} else {
				return this.shelf.cta_text || 'הוספה לסל';
			}
		},
	},
	created() {},
	mounted() {},
	methods: {
		async addToCart(shelf) {
			// SELECTED SIZE ERROR
			if (!this.userSelectedSize) {
				this.$emit('select-size-error');
				return;
			}

			// Handle show go to payment
			if (this.showGoToPayment) {
				// From mixin
				if (this.hoodiesCustom) {
					this.$store.dispatch('toggleLoader', true);
					this.$analytics.goToCheckout(this.subtotal);
					this.goToHoodiesCheckout();
					return;
				} else {
					this.$analytics.goToCheckout(this.subtotal);
					this.$router.replace('/checkout/shipping-options');
					return;
				}
			}

			// NOT SURE ???
			setTimeout(function() {
				let el = document.querySelector(':focus');
				if (el) el.blur();
			}, 300);

			// HANDLE CART ITEM IMAGE
			const image = this.getCartItemImage(shelf);

			// SETUP ITEM
			const variationAttributeIds = this.getVariationAttributeIds(
				this.selectedAttributes
			);
			const item = this.createItem(
				shelf,
				variationAttributeIds,
				this.selectedAttributes,
				this.selectedProperty,
				image
			);

			// ADD ITEM TO STATE
			await this.$store.dispatch('cart/add', {
				item,
				storeSlug: this.storeSlug,
			});

			// INTEGRATE WITH CONNECTORS
			if (this.cartIntegration && this.cartIntegration.connector) {
				if (this.cartIntegration.connector === 'WOOCOMMERCE') {
					console.log('WOOCOMMERCE');
					const woocommerceService = new WoocommerceService();
					woocommerceService.addToCart(item);
				}
			}

			// ANALYTICS
			this.$analytics.addToCart(item.shelfSlug, item.variationSlug);
			if (typeof fbq !== 'undefined' && fbq) {
				fbq('track', 'AddToCart', {
					content_name: `${this.shelf.name} - ${this.variation.property_label}`,
					content_category: this.storeSlug,
					content_ids: [this.variation.variationId],
					content_type: 'product',
					value: this.variation.finalPrice,
					currency: this.variation.currency,
				});
			}

			this.$emit('setGoToPayment');
			console.log('Cart / Add to cart', item);
		},
		getVariationAttributeIds(selectedAttributes) {
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

			return variationAttributeIds;
		},

		createItem(
			shelf,
			variationAttributeIds,
			selectedAttributes,
			selectedProperty,
			image
		) {
			const item = {
				shelfId: shelf.id,
				name: shelf.name,
				shelfSlug: shelf.slug,
				currency: this.variation.currency,
				price: this.variation.price,
				sale_price: this.variation.sale_price,
				variationId: this.variation.variationId,
				variationSlug: this.variation.slug,
				quantity: 1,
				image,
				variationAttributeIds,
				// variationAttributeId: this.variant
				attributes: { ...selectedAttributes, ...selectedProperty },
				// sizes: removeDuplicates(sizes, 'value'),
			};
			delete item.assets;
			delete item.variations;

			return item;
		},

		getCartItemImage(shelf) {
			let image = this.assetsPath;
			if (this.variation.assets[0].src) {
				image += this.variation.assets[0].src;
			} else {
				// Story shelf - or non-lazyloaded shelf
				if (this.variation.assets[0]) {
					image += `${shelf.slug}/${this.variation.slug}/${
						this.variation.assets[0]
					}`;
				}
			}

			return image;
		},
	},
};
