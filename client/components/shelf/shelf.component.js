import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import { removeDuplicates } from '@/helpers/collection.helpers';
export default {
	name: 'shelf',
	components: { ShelfContent, ColorPicker, SizePicker, AddToCart },
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
			selectedVariantIndex: 0,
		};
	},
	computed: {
		variant() {
			return this.shelf.variations[this.selectedVariantIndex];
		},
		hasColorPicker() {
			return !!this.variant.color;
		},
		hasSizePicker() {
			return !!this.variant.size;
		},
		variantsPickersClass() {
			let num = 0;
			if (this.hasSizePicker) {
				num++;
			}

			if (this.hasColorPicker) {
				num++;
			}

			return `variants-pickers-${num}`;
		},
		colors() {
			return removeDuplicates(
				this.shelf.variations.map(variant => variant.color),
				'label'
			);
		},
	},
	created() {},
	mounted() {
		this.swiper = new this.$Swiper(`#shelf-content-slider-${this.shelfIndex}`, {
			// Optional parameters
			direction: 'horizontal',
			loop: true,

			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				renderBullet: (index, className) => {
					const shelfContentType = this.variant.shelfContent[index].type;
					let bullet = '';
					switch (shelfContentType) {
						case 'image':
							bullet = 'img';
							break;
						case 'video':
							bullet = 'vid';
							break;
						case 'description':
							bullet = 'פרטים';
							break;
					}
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
	},
	methods: {
		switchVariant(options) {
			switch (options.type) {
				case 'color':
					const colorLabel = options.payload.label;
					const variantIndex = this.shelf.variations.findIndex(variant => {
						if (variant.color) {
							return variant.color.label === colorLabel;
						}
					});
					if (variantIndex > -1) {
						this.selectedVariantIndex = variantIndex;
					}
					break;
			}
		},
	},
};
