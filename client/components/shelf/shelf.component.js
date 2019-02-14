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
			swiper: null,
			selectedColor: {
				value: '',
			},
			selectedSize: {
				value: null,
			},
			selectedAttributes: {},
			showShelfInfo: false,
			showShelfSale: false,
			storeName: null,
		};
	},
	computed: {
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
			// console.log('attributes', attributes);
			const attributesKeys = Object.keys(attributes);

			// console.log('attributesKeys', attributesKeys);
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
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'](this.storeSlug);
		},
		...mapState({
			shippingDetails: state => state.store.shippingDetails,
			returnsPolicy: state => state.store.returnsPolicy,
			// slug: state => state.store,
		}),
		description() {
			return this.shelf.description;
		},
		info() {
			return this.shelf.info;
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	// watch: {
	// 	variant: function(val) {

	// 	}
	// },
	created() {
		this.selectedAttributes = this.shelf.variations[0].attrs || null;
	},
	mounted() {
		this.storeName = this.$route.params.storeName;
	},
	methods: {
		getAssetsPath(storeSlug, shelfSlug, variantSlug) {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${storeSlug}/${shelfSlug}/${variantSlug}/`;
			}

			return path;
		},
		updateSwiperSlides() {
			// this.swiper.removeAllSlides();

			let slides = [];
			for (let content of this.variant.content) {
				let slide;
				if (content.type === 'image') {
					console.log('&&&&', content.value);
					slide = `
						<div class="shelf-content swiper-slide" style="background-image: url('${
							content.value
						}'); background-size: cover; background-repeat: no-repeat"></div>
					`;
				}

				if (content.type === 'video') {
					slide = `
						<div class="shelf-content swiper-slide">
							<img src="${content.value}" />
						</div>
					`;
				}
				// const slide = `
				// 	<div class="shelf-content swiper-slide">
				// 		<!-- Image -->
				// 		<img v-if="content.type == 'image'" :src="content.value" />

				// 		<!-- Video -->
				// 		<video-player
				// 			v-if="content.type == 'video'"
				// 			:source="content.value"
				// 		></video-player>
				// 	</div>
				// 	`;
				if (slide) {
					slides.push(slide);
				}
			}

			console.log('slides', slides);
			this.swiper.appendSlide(slides);
			this.swiper.slideToLoop(0);
		},
		setAtt({ att, attKey }) {
			console.log(attKey, att);
			this.selectedAttributes[attKey] = att;
		},
		playVideo() {
			const video = document.getElementById('video');
			console.log('video', video);
			const playpause = document.getElementById('playpause');
			if (video.paused || video.ended) {
				playpause.title = 'pause';
				playpause.innerHTML = 'pause';
				video.play();
			} else {
				playpause.title = 'play';
				playpause.innerHTML = 'play';
				video.pause();
			}
		},
	},
};
