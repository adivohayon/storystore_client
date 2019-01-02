import ShelfContent from './../shelf-content';
import ColorPicker from './../color-picker';
import SizePicker from './../size-picker';
import AddToCart from './../add-to-cart';
import ShelfTitle from './../shelf-title';
import ShelfInfo from './../shelf-info';
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
			selectedVariantIndex: 0,
			selectedColor: null,
			selectedSize: null,
			showShelfInfo: false,
		};
	},
	computed: {
		variant() {
			return this.shelf.variations.find(variant => {
				return (
					variant.size === this.selectedSize &&
					variant.color.label === this.selectedColor.label
				);
			});
		},
		colors() {
			return removeDuplicates(
				this.shelf.variations.map(variant => variant.color),
				'label'
			);
		},
		sizes() {
			return [...new Set(this.shelf.variations.map(variant => variant.size))];
		},
	},
	created() {
		this.selectedColor = this.shelf.variations[0].color || null;
		this.selectedSize = this.shelf.variations[0].size || null;
	},
	mounted() {
		this.swiper = new this.$Swiper(`#shelf-content-slider-${this.shelfIndex}`, {
			// Optional parameters
			direction: 'horizontal',
			loop: true,
			// If we need pagination
			pagination: {
				el: '.shelf-content__pagination',
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
		// const fullpageEl = document.getElementById('fullpage');
		// fullpageEl.build();
		// console.log('fullpage', fullpageEl);
	},
	methods: {
		setSize(size) {
			console.log('Shelf / setSize', size);
			this.selectedSize = size;
		},
		async setColor(color) {
			console.log('Shelf / setColor', color);
			this.selectedColor = color;
			await this.$nextTick();
		},
	},
};
