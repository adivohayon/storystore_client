import { mapState } from 'vuex';

import _get from 'lodash/get';
import _orderBy from 'lodash.orderby';
// import _isEmpty from 'lodash.isempty';
import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
import Loader from './../loader';
import VideoPlayer from './../video-player';
import AttributePicker from './../attribute-picker';
import { removeDuplicates } from '@/helpers/collection.helpers';
import _debounce from 'lodash.debounce';
export default {
	name: 'shelf',
	components: {
		ShelfContent,
		ColorPicker,
		SizePicker,
		AddToCart,
		ShelfTitle,
		ShelfInfo,
		VideoPlayer,
		AttributePicker,
		Loader,
	},
	props: {
		shelf: {
			type: Object,
			default: () => {
				return {};
			},
		},
		fullpage: {
			type: Object,
			default: () => {
				return {};
			},
		},
		shelfIndex: {
			type: Number,
		},
	},
	data() {
		return {
			// selectedAttributes: {},
			selectedVariationId: null,
			selectedAttributes: {},
			showShelfInfo: false,
			selectedProperty: {},
			alreadySwiped: false,
			carouselOptions: {
				loop: true,
				perPage: 1,
				rtl: false,
			},
			hooperOptions: {
				itemsToShow: 1,
				// infiniteScroll: true,
				mouseDrag: false,
				touchDrag: true,
				shortDrag: false,
			},
			glideOptions: {
				type: 'slider',
				perView: 1,
				gap: 0,
				rewind: false,
				// bound: true,
				dragThreshold: 150,
				swipeThreshold: 250,
			},
			viewportWidth: null,
			currentSlideIndex: 0,
			showSpacer: false,
			swiperOption: {
				pagination: {
					el: '.swiper-pagination',
				},
				slidesPerView: 1,
				speed: 500,
				iOSEdgeSwipeDetection: true,
				threshold: 10,
				effect: 'fade',
				// loop: true,
				// some swiper options...
			},
			// variant: null,
		};
	},
	computed: {
		...mapState({
			shippingDetails: state => state.store.shippingDetails,
			returns: state => state.store.returns,
			storeSlug: state => state.store.slug,
		}),
		shelfGoal() {
			if (this.storeSlug === 'oz-nadlan') {
				return 'CONTACT';
			} else {
				return 'PURCHASE';
			}
		},
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/`;

			return path;
		},
		logoSrc() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/logo_${this.storeSlug}_white.png`;
			return path;
		},
		variantAssets() {
			const assets = _get(this.variant, 'assets', []);
			return assets.map(asset =>
				asset.loaded ? this.assetsPath + asset.src : ''
			);
			// let img = 'url(';
			// img += asset.loaded ? this.assetsPath + asset.src : '';
			// img += ')';
			// return img;

			// return images
			// 	.filter(asset => asset.loaded)
			// 	.map(asset => {
			// 		return this.assetsPath + asset.src;
			// 	});
		},
		variantProperties() {
			const properties = {};
			const itemProperty = _get(this.variant, 'itemProperty', {
				type: 'NO_PROPERTY',
				label: '',
			});
			if (itemProperty && itemProperty.type && itemProperty.label) {
				const attributesArr = this.shelf.variations.map(variant => {
					return {
						label: variant.property_label,
						value: variant.property_value,
						variationId: variant.variationId,
					};
				});
				properties[itemProperty.type] = {
					available: attributesArr,
					label: itemProperty.label,
				};
			}

			return properties;
		},
		availableAttributes() {
			const attributesArr = _get(this.variant, 'attributes', []);

			const attributes = {};
			for (const attribute of attributesArr) {
				// first time added to list
				const attributeKey = attribute.itemProperty
					? attribute.itemProperty.type
					: 'no_attribute';
				if (!attributes.hasOwnProperty(attributeKey)) {
					attributes[attributeKey] = {
						available: [],
						label: attribute.itemProperty ? attribute.itemProperty.label : null,
					};
				}

				// Push available
				attributes[attributeKey].available.push({
					label: attribute.label || null,
					value: attribute.value || null,
					variationAttributeId: attribute.variationAttribute.id,
				});
			}
			return attributes;
			// attributesArr.
		},
		variantVideo() {
			// return _get(this.variant, 'assets.images', []);
			// if (this.variant.assets) {
			// 	const videoArray = this.variant.assets.filter(video => {
			// 		return video.type === 'video';
			// 	});
			// 	// console.log('videoArray', videoArray);
			// 	return videoArray[0];
			// }
		},
		variant() {
			return this.shelf.variations.find(
				variant => variant.variationId === this.selectedVariationId
			);
		},
		sortedVariations() {
			return _orderBy(this.shelf.variations, ['variation_order'], ['asc']);
			return this.shelf.variation;
		},
	},
	created() {
		this.initializeVariation();
		this.initializeSelectedAttributes();
		this.initializeSelectedProperty();
	},
	mounted() {
		this.viewportWidth = window.innerWidth;
		// this.$refs.carousel.addEventListener(
		// 	'scroll',
		// 	_debounce(this.handleScroll, 100)
		// );
		// window.addEventListener('scroll', _debounce(this.handleScroll, 100));
		// document.addEventListener('touchend', this.handleTouch);
		// this.$refs.carousel.addEventListener(
		// 	'touchmove',
		// 	_debounce(this.handleScroll, 100)
		// );
	},
	beforeDestroy() {
		// this.$refs.carousel.removeEventListener(
		// 	'scroll',
		// 	_debounce(this.handleScroll, 100)
		// );
	},
	methods: {
		handleTouch(e) {
			console.log('scrollLeft', e);
		},
		handleScroll(e) {
			// console.log('viewportWidth', this.viewportWidth);
			// console.log('scrollLeft', e.target.scrollLeft);
			if (e.target.scrollLeft % this.viewportWidth === 0) {
				this.currentSlideIndex = e.target.scrollLeft / this.viewportWidth;
			}
		},
		swipeDown() {
			this.alreadySwiped = true;
			// fullpage_api.moveSectionDown();
		},
		initializeVariation() {
			this.selectedVariationId = this.shelf.variations[0].variationId;
		},
		initializeSelectedAttributes() {
			for (const attributeKey in this.availableAttributes) {
				if (this.availableAttributes.hasOwnProperty(attributeKey)) {
					const availableAttribute = _get(
						this.availableAttributes,
						[attributeKey, 'available'],
						[]
					);
					const itemPropertyLabel = _get(
						this.availableAttributes,
						[attributeKey, 'label'],
						''
					);
					const selectedAttribute = {
						...availableAttribute[0],
						itemPropertyLabel,
					};
					this.$set(this.selectedAttributes, attributeKey, selectedAttribute);
				}
			}
		},
		initializeSelectedProperty() {
			if (
				this.variant.itemProperty &&
				this.variant.itemProperty.type &&
				this.variant.itemProperty.label
			) {
				this.selectedProperty = {};

				this.$set(this.selectedProperty, this.variant.itemProperty.type, {
					label: this.variant.property_label,
					value: this.variant.property_value,
					itemPropertyLabel: this.variant.itemProperty.label,
				});
			}
		},
		setAtt({ att, attKey }) {
			// Changed variant
			if (att.variationId) {
				this.selectedProperty[attKey] = {
					...att,
					itemPropertyLabel: this.variantProperties[attKey].label,
				};
				this.selectedVariationId = att.variationId;

				// Load assets
				this.variant.assets.forEach((asset, assetIndex) => {
					const variationIndex = this.shelf.variations.findIndex(
						variation => variation.variationId === this.variant.variationId
					);
					this.$store.commit('store/updateShelfAssetLoaded', {
						shelfIndex: this.shelfIndex,
						variationIndex,
						assetIndex,
						loaded: true,
					});
				});
				// this.$refs.carousel.go('=0');
				// this.$refs.carousel.restart();
				// this.$refs.carousel.slideTo(0);
				// this.$emit('rebuild-fullpage', { activeSlideIndex: 0 });
				// this.$refs.carousel.destroy(false, () => {
				// 	this.$refs.carousel.init();
				// });
			} else {
				this.selectedAttributes[attKey] = {
					...att,
					itemPropertyLabel: this.availableAttributes[attKey].label,
				};
			}

			// fullpage_api.moveTo(this.shelfIndex + 1, 0);
		},
		getImage(asset) {
			// [asset.loaded ? backgroundImage: 'url(' + image + ')' }
			let img = 'url(';
			img += asset.loaded ? this.assetsPath + asset.src : '';
			img += ')';
			return img;
		},
	},
};
