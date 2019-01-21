import { mapState } from 'vuex';

import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
import ShelfSale from './../shelf-sale';
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
			selectedColor: null,
			selectedSize: null,
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

					console.log('variant', variant.attributes);

					return (
						variant.attributes.size.value === this.selectedSize.value &&
						variant.attributes.color.label === this.selectedColor.label
					);
				});

				console.log('variantIndex', variantIndex);
				return this.shelf.variations[variantIndex > -1 ? variantIndex : 0];
			}
		},
		colors() {
			if (this.shelf.variations.length > 1) {
				return removeDuplicates(
					this.shelf.variations.map(variant => {
						const color = { ...variant.attributes.color };
						color.image = variant.content[0].value;
						return color;
					}),
					'label'
				);
			} else {
				return [];
			}
		},
		sizes() {
			if (this.shelf.variations.length > 1) {
				return [
					...new Set(
						this.shelf.variations.map(variant => variant.attributes.size)
					),
				];
			} else {
				return [];
			}
		},
		cartItemsCount() {
			return this.$store.getters['cart/itemsCount'];
		},
		...mapState({
			shippingDetails: state => state.store.shippingDetails,
			returnsPolicy: state => state.store.returnsPolicy,
			// slug: state => state.store,
		}),
		description() {
			return this.shelf.description;
		},
	},
	created() {
		this.selectedColor = this.shelf.variations[0].attributes.color || null;
		this.selectedSize = this.shelf.variations[0].attributes.size || null;
	},
	mounted() {
		this.storeName = this.$route.params.storeName;
		this.swiper = new this.$Swiper(`#shelf-content-slider-${this.shelfIndex}`, {
			// Optional parameters
			direction: 'horizontal',
			loop: true,
			// If we need pagination
			pagination: {
				el: '.shelf-content__pagination',
				clickable: true,
				renderBullet: (index, className) => {
					const shelfContentType = this.variant.content[index].type;
					let bullet = '';

					// if you want to add text under pagination uncomment below.

					// switch (shelfContentType) {
					// 	case 'image':
					// 		bullet = 'img';
					// 		break;
					// 	case 'video':
					// 		bullet = 'vid';
					// 		break;
					// 	case 'description':
					// 		bullet = 'פרטים';
					// 		break;
					// }
					return '<span class="' + className + '">' + bullet + '</span>';
				},
			},
			// Navigation arrows
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			// And if we need scrollbar
			scrollbar: {
				el: '.swiper-scrollbar',
			},
		});

		this.updateSwiperSlides();
		// const fullpageEl = document.getElementById('fullpage');
		// fullpageEl.build();
		// console.log('fullpage', fullpageEl);
	},
	methods: {
		updateSwiperSlides() {
			this.swiper.removeAllSlides();

			let slides = [];
			for (let content of this.variant.content) {
				let slide;
				if (content.type === 'image') {
					slide = `
						<div class="shelf-content swiper-slide">
							<img src="${content.value}" />
						</div>
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
		setSize(size) {
			console.log('Shelf / setSize', size);
			this.selectedSize = size;
			// this.updateSwiperSlides();
		},
		async setColor(color) {
			console.log('Shelf / setColor', color.label);
			this.selectedColor = color;
			this.updateSwiperSlides();
			// await this.$nextTick();
			// this.swiper.update();
		},
	},
};
