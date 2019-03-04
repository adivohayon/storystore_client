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
			// Hidden assumption: attribute keys are the same for variations of the same shelf
			const attributes = _get(this.shelf, 'variations[0].attrs', {});
			const attributesKeys = Object.keys(attributes);
			return attributesKeys;
		},
		attributes() {
			const attributes = {};
			// attributes.color = []
			/*
				Start point: "M" should be disabled
			*/
			/*
				{
					color: [
						{label: 'black', value: '#4324234'},
						{label: 'blue', value: '#5324234'},
					],
					size: [
						{label: 'S', value: 'S'}
						{label: 'M', value: 'M', disabled: true}
					]
				}
			*/

			// return this.shelf.variations.map(v => v.attrs);

			// Loop through the different attribute keys (size, color...)
			for (let attributeKey of this.attributesKeys) {
				attributes[attributeKey] = [];

				const selectedAttribute = this.selectedAttributes[attributeKey];

				const returnKey = attributeKey === 'size' ? 'color' : 'size';
				if (this.shelf.id == 6) {
					const availableAttributes = this.getAvailableAttributesForSelected(
						this.shelf.variations,
						attributeKey,
						selectedAttribute.value,
						returnKey
					);
					console.log('Available Attributes', availableAttributes);
				}

				// console.log(
				// 	'attributeKey - ' + attributeKey + ' - ' + selectedAttribute.value,
				// 	availableAttributes
				// );
				// Loop through variations
				for (let variant of this.shelf.variations) {
					const attr = _get(variant, ['attrs', attributeKey], null);
					if (attr) {
						const attrIndex = attributes[attributeKey].findIndex(
							_attr => _attr.value === attr.value
						);

						// Add only if it doesn't exist
						if (attrIndex === -1) {
							attributes[attributeKey].push(attr);
						}
					}
				}
			}
			// // console.log('attributes', attributes);
			return attributes;
		},
	},
	created() {
		this.selectedAttributes =
			Object.assign({}, this.shelf.variations[0].attrs) || null;

		// const availableSizesForBlack = this.getAvailableAttributesForSelected(
		// 	this.shelf.variations,
		// 	'color',
		// 	'#000000',
		// 	'size'
		// );
		// console.log('test', test);
	},
	mounted() {
		if (this.shelf.id == 6) {
			const sizes = this.getAvailableSizes('blue');
			console.log('sizes', sizes);
		}
	},
	methods: {
		// (selectedColor /selectedSize / selectedAttr) => availableAttrs
		getAvailableSizes(variationSlug) {
			const allSizes = [];
			// Loop through all variations
			console.log('variationSlug', variationSlug);
			const filteredVariations = this.shelf.variations.filter(
				variant => variant.slug === variationSlug
			);
			console.log('filteredVariations', filteredVariations);
			const availableSizes = filteredVariations.map(
				variant => variant.attrs.size
			);

			return availableSizes;

			// for (let variant of this.shelf.variations) {
			// 	// return attrs.size for attrs that this is true:
			// 	// variant.attrs.color.value === selectedColor.value
			// 	console.log('variant.attrs', variant.attrs);
			// 	const variantSize = Object.assign({}, variant.attrs.size);
			// 	const sizeAlreadyExists =
			// 		allSizes.findIndex(size => size.value === variantSize.value) > -1;

			// 	const variantColor = variant.attrs.color;

			// 	if (!sizeAlreadyExists) {
			// 		console.log(
			// 			'selected color: ' + selectedColor.value,
			// 			'variant color: ' + variantColor.value
			// 		);
			// 		console.log('variant size: ', variantSize);
			// 		// variantSize.enabled = selectedColor.value === variantColor.value;
			// 		// allSizes.push(variantSize);

			// 		if (selectedColor.value === variantColor.value) {
			// 			// variantSize.enabled = selectedColor.value === variantColor.value;
			// 			allSizes.push(variantSize);
			// 		}
			// 	}

			// 	// if (
			// 	// 	availableSizes.findIndex(size => size.value === pushedSize.value) ===
			// 	// 	-1
			// 	// ) {
			// 	// 	console.log(variant.attrs.color.value, selectedColor.value);
			// 	// 	pushedSize.enabled =
			// 	// 		variant.attrs.color.value === selectedColor.value;
			// 	// 	availableSizes.push(pushedSize);
			// 	// }

			// 	// if (variant.attrs.color.value === selectedColor.value) {
			// 	// }
			// }
			// console.log('allSizes', allSizes);
			// return allSizes;
		},

		// TODO: change returnedKey to array
		getAvailableAttributesForSelected(
			variations,
			comparisonKey,
			selectedAttributeValue,
			returnedKey
		) {
			// console.log('###############');
			// console.log('getAvailableAttributes - Shelf', this.shelf.name);
			// console.log(
			// 	`Checking available '${returnedKey}s' for ${comparisonKey} '${selectedAttributeValue}'`
			// );
			// console.log('###############');
			const availableAttributes = {};
			availableAttributes[returnedKey] = [];

			variations.forEach(variant => {
				// const attr = _get(variant, ['attrs', returnedKey]);
				// const attrIndex = availableAttributes[returnedKey].findIndex(
				// 	_attr => _attr.value === attr.value
				// );
				// if attribute doesn't already exist in the array
				// if (attrIndex === -1) {
				// const checkedAttribute = variant.attrs[comparisonKey];
				// if (checkedAttribute.value === selectedAttributeValue) {
				// 	checkedAttribute.enabled = true;
				// }
				// // const avaiilableAttribute = variant.attrs[returnedKey];
				// // // if selected attribute value is equal to current variant value, it is enabled, otherwise it's disabled
				// // if (variant.attrs[attributeKey].value === selectedAttributeValue) {
				// // 	avaiilableAttribute.disabled = false;
				// // }
				// availableAttributes[returnedKey].push(checkedAttribute);
				// }
			});

			return availableAttributes;
		},
		setAtt({ att, attKey }) {
			this.selectedAttributes[attKey] = att;
			fullpage_api.moveTo(this.shelfIndex + 1, 0);
		},
	},
};
