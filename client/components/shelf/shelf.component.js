import { mapState } from 'vuex';

import _get from 'lodash/get';
import _orderBy from 'lodash.orderby';
// import _isEmpty from 'lodash.isempty';
import ShelfContent from './../shelf-content';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
import VideoPlayer from './../video-player';
import AttributePicker from './../attribute-picker';
import AddToCart from './../add-to-cart';
import ContactForm from '@/components/contact-form';
import Scrims from '@/components/scrims';
export default {
	name: 'shelf',
	components: {
		ShelfContent,
		ShelfTitle,
		ShelfInfo,
		VideoPlayer,
		AttributePicker,
		AddToCart,
		ContactForm,
		Scrims,
	},
	props: {
		shelf: {
			type: Object,
			default: () => {
				return {};
			},
		},
		shelfIndex: {
			type: Number,
		},
		showSeeMore: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			// selectedAttributes: {},
			ctaClicked: false,
			showGoToPayment: false,
			selectedVariationId: null,
			selectedAttributes: {},
			// showShelfInfo: false,
			selectedProperty: {},
			currentSlideIndex: 0,
			showSpacer: false,
			// assetsSwiper: null,
			swiperOption: {
				pagination: {
					el: '.swiper-pagination',
				},
				// autoplay: {
				// 	delay: 1000,
				// 	stopOnLastSlide: false,
				// 	disableOnInteraction: true,
				// },
				slidesPerView: 1,
				speed: 500,
				iOSEdgeSwipeDetection: true,
				threshold: 10,
				effect: 'fade',
				loop: false,
				// loopedSlides: 1,
				on: {},
			},
		};
	},

	computed: {
		...mapState({
			shippingDetails: state => state.store.shippingDetails,
			returns: state => state.store.returns,
			storeSlug: state => state.store.slug,
		}),
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
		shelfTitle() {
			if (this.storeSlug === 'alinecohen') {
				return (
					this.shelf.name +
					' - ' +
					this.variant.property_label
				).toUpperCase();
			} else {
				return this.shelf.name;
			}
		},
		variantAssets() {
			// console.log('$nuxt.$route.name', this.$nuxt.$route.name);
			const assets = _get(this.variant, 'assets', []);

			// if (this.$nuxt.$route.name === 'category') {
			// 	return assets.map(
			// 		asset =>
			// 			`${this.assetsPath}/${this.shelf.slug}/${
			// 				this.variant.slug
			// 			}/${asset}`
			// 	);
			// } else {
			return assets.map(asset =>
				asset.loaded ? this.assetsPath + asset.src : ''
			);
			// }
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
					external_id: attribute.variationAttribute.external_id,
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
			// return this.shelf.variation;
		},
		shelfType() {
			return _get(this.shelf, 'type', 'ADD_TO_CART');
		},
		hasScrims() {
			// return this.shelfType === 'CONTACT_FORM';
			return true;
		},
		footerBottom() {
			if (this.shelfIndex === 0 && this.showSeeMore) {
				return '6rem';
			}

			return '0';
		},
		feedSettings() {
			return _get(this.$store.state, 'store.settings.feed', {
				scrims: true,
				seperators: false,
				autoplay: false,
			});
		},
	},
	created() {},
	mounted() {
		this.initializeVariation();
		this.initializeSelectedAttributes();
		this.initializeSelectedProperty();
	},

	methods: {
		initializeVariation() {
			console.log('variation', this.shelf);
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

				// Do not run this in category page as there is currently no lazy loading

				const variationIndex = this.shelf.variations.findIndex(
					variation => variation.variationId === this.variant.variationId
				);

				this.$analytics.productView(
					this.shelf.slug,
					this.shelf.variations[variationIndex].slug
				);

				// Load assets
				this.variant.assets.forEach((asset, assetIndex) => {
					this.$store.commit('store/updateShelfAssetLoaded', {
						shelfIndex: this.shelfIndex,
						variationIndex,
						assetIndex,
						loaded: true,
					});
				});

				// go to first slide
				if (this.assetsSwiper) {
					console.log('this.assets', this.assetsSwiper);
					this.assetsSwiper.slideTo(0);
				}
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
		// HACKING
		scrollTo(scrollIndex) {
			this.$emit('scroll-to', scrollIndex);
		},
		ctaClickedHandle() {
			this.ctaClicked = false;
			setTimeout(() => {
				this.ctaClicked = true;
			}, 30);
		},
	},
};
