import { mapState } from 'vuex';

import _get from 'lodash/get';
// import _isEmpty from 'lodash.isempty';
import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
import VideoPlayer from './../video-player';
import AttributePicker from './../attribute-picker';
import { removeDuplicates } from '@/helpers/collection.helpers';
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
	},
	data() {
		return {
			// selectedAttributes: {},
			selectedVariationId: null,
			selectedAttributes: {},
			showShelfInfo: false,
			selectedProperty: {},
			// variant: null,
		};
	},
	computed: {
		...mapState({
			shippingDetails: state => state.store.shippingDetails,
			returns: state => state.store.returns,
			storeSlug: state => state.store.slug,
		}),
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/${this.shelf.slug}/${this.variant.slug}/`;

			return path;
		},
		logoSrc() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			path += `${this.storeSlug}/logo_${this.storeSlug}_white.png`;
			return path;
		},
		variantImages() {
			const images = _get(this.variant, 'assets', []);
			return images.map(imageName => {
				return this.assetsPath + imageName;
			});
		},
		variantProperties() {
			const properties = {};
			const itemProperty = _get(this.variant, 'itemProperty');
			const attributesArr = this.shelf.variations.map(variant => {
				return {
					label: variant.property_label,
					value: variant.property_value,
					variationId: variant.id,
				};
			});
			properties[itemProperty.type] = {
				available: attributesArr,
				label: itemProperty.label,
			};

			return properties;
		},
		availableAttributes() {
			const attributesArr = _get(this.variant, 'attributes', []);
			const attributes = {};
			for (const attribute of attributesArr) {
				// first time added to list
				if (!attributes.hasOwnProperty(attribute.itemProperty.type)) {
					attributes[attribute.itemProperty.type] = {
						available: [],
						label: attribute.itemProperty.label,
					};
				}

				// Push available
				attributes[attribute.itemProperty.type].available.push({
					label: attribute.label,
					value: attribute.value,
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
				variant => variant.id === this.selectedVariationId
			);
		},
	},
	created() {
		this.initializeVariation();
		this.initializeSelectedAttributes();
		this.initializeSelectedProperty();
	},
	mounted() {},
	methods: {
		initializeVariation() {
			this.selectedVariationId = this.shelf.variations[0].id;
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
			this.selectedProperty = {};

			this.$set(this.selectedProperty, this.variant.itemProperty.type, {
				label: this.variant.property_label,
				value: this.variant.property_value,
				itemPropertyLabel: this.variant.itemProperty.label,
			});
		},
		setAtt({ att, attKey }) {
			if (att.variationId) {
				this.selectedProperty[attKey] = {
					...att,
					itemPropertyLabel: this.variantProperties[attKey].label,
				};
				this.selectedVariationId = att.variationId;
			} else {
				this.selectedAttributes[attKey] = {
					...att,
					itemPropertyLabel: this.availableAttributes[attKey].label,
				};
			}
			fullpage_api.moveTo(this.shelfIndex + 1, 0);
		},
	},
};
