import { mapState } from 'vuex';

import _get from 'lodash/get';
import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
import ShelfSale from './../shelf-sale';
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
		ShelfSale,
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
					if (!variant.attributes) {
						return false;
					}

					// console.log('variant', variant.attributes);
					/*
						return the variant in which ALL variant attributes are matched to the selected attributes
					*/
					let isVariant = false;

					isVariant = this.attributesKeys.every(attributeKey => {
						return (
							_get(variant, ['attributes', attributeKey, 'value']) ===
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

				console.log('variantIndex', variantIndex);
				return this.shelf.variations[variantIndex > -1 ? variantIndex : 0];
			}
		},
		variantImages() {
			return this.variant.content.filter(contentItem => {
				return contentItem.type === 'image';
			});
		},
		variantVideo() {
			const videoArray = this.variant.content.filter(video => {
				return video.type === 'video';
			});
			// console.log('videoArray', videoArray);
			return videoArray[0];
			// const a = videoArray[0];
			// console.log('a', a);
			// return a;
		},
		attributesKeys() {
			const attributes = _get(this.shelf, 'variations[0].attributes', {});
			console.log('attributes', attributes);
			const attributesKeys = Object.keys(attributes);

			console.log('attributesKeys', attributesKeys);
			return attributesKeys;
		},
		attributes() {
			const attributes = {};
			for (let attributeKey of this.attributesKeys) {
				attributes[attributeKey] = removeDuplicates(
					this.shelf.variations.map(variant => {
						return variant.attributes[attributeKey];
					}),
					'value'
				);
			}
			console.log('attributes', attributes);
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
		storeSlug() {
			return this.$route.params.storeSlug || null;
		},
	},
	// watch: {
	// 	variant: function(val) {

	// 	}
	// },
	created() {
		this.selectedAttributes = this.shelf.variations[0].attributes || null;
	},
	mounted() {
		this.storeName = this.$route.params.storeName;
		// this.swiper = new this.$Swiper(`#shelf-content-slider-${this.shelfIndex}`, {
		// 	// Optional parameters
		// 	direction: 'horizontal',
		// 	loop: true,
		// 	// If we need pagination
		// 	pagination: {
		// 		el: '.shelf-content__pagination',
		// 		clickable: true,
		// 		renderBullet: (index, className) => {
		// 			const shelfContentType = this.variant.content[index].type;
		// 			let bullet = '';

		// 			// if you want to add text under pagination uncomment below.

		// 			// switch (shelfContentType) {
		// 			// 	case 'image':
		// 			// 		bullet = 'img';
		// 			// 		break;
		// 			// 	case 'video':
		// 			// 		bullet = 'vid';
		// 			// 		break;
		// 			// 	case 'description':
		// 			// 		bullet = 'פרטים';
		// 			// 		break;
		// 			// }
		// 			return '<span class="' + className + '">' + bullet + '</span>';
		// 		},
		// 	},
		// 	// Navigation arrows
		// 	navigation: {
		// 		nextEl: '.swiper-button-next',
		// 		prevEl: '.swiper-button-prev',
		// 	},
		// 	// And if we need scrollbar
		// 	scrollbar: {
		// 		el: '.swiper-scrollbar',
		// 	},
		// });

		// this.updateSwiperSlides();
		// const fullpageEl = document.getElementById('fullpage');
		// fullpageEl.build();
		// console.log('fullpage', fullpageEl);
	},
	methods: {
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
