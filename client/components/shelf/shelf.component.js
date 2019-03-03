import { mapState } from 'vuex';

import _get from 'lodash/get';
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
			selectedColor: {
				value: '',
			},
			selectedSize: {
				value: null,
			},
			selectedAttributes: {},
			showShelfInfo: false,
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
		variant() {
			if (this.shelf.variations.length) {
				const variantIndex = this.shelf.variations.findIndex(variant => {
					if (!variant.attrs) {
						return false;
					}

					// console.log('variant', variant.attributes);
					/*
						return the variant in which ALL variant attributes are matched to the selected attributes
					*/
					let isVariant = false;

					isVariant = this.attributesKeys.every(attributeKey => {
						return (
							_get(variant, ['attrs', attributeKey, 'value']) ===
							_get(this.selectedAttributes, [attributeKey, 'value'])
						);
					});
					return isVariant;
					// return (
					// 	_get(variant, 'attributes.size.value', false) ===
					// 		this.selectedSize.value &&
					// 	_get(variant, 'attributes.color.value', false) ===
					// 		this.selectedColor.value
					// );
				});

				// console.log('variantIndex', variantIndex);
				return this.shelf.variations[variantIndex > -1 ? variantIndex : 0];
			}
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
			const images = _get(this.variant, 'assets.images', []);
			return images.map(imageName => {
				return this.assetsPath + imageName;
			});
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
		attributesKeys() {
			const attributes = _get(this.shelf, 'variations[0].attrs', {});
			const attributesKeys = Object.keys(attributes);
			return attributesKeys;
		},
		attributes() {
			const attributes = {};
			// Loop through the different attribute keys
			for (let attributeKey of this.attributesKeys) {
				const withDuplicates = [];
				// Loop through variations
				for (let variant of this.shelf.variations) {
					const hasValue = _get(
						variant,
						['attrs', attributeKey, 'value'],
						false
					);
					if (hasValue && hasValue.length > 0) {
						withDuplicates.push(variant.attrs[attributeKey]);
					}
				}

				const noDuplicates = removeDuplicates(withDuplicates, 'value');
				if (noDuplicates.length > 0) {
					attributes[attributeKey] = noDuplicates;
				}
			}
			// console.log('attributes', attributes);
			return attributes;
		},
	},
	created() {
		this.selectedAttributes =
			Object.assign({}, this.shelf.variations[0].attrs) || null;
	},
	mounted() {},
	methods: {
		setAtt({ att, attKey }) {
			this.selectedAttributes[attKey] = att;
			fullpage_api.moveTo(this.shelfIndex + 1, 0);
		},
	},
};
