import ShelfContent from './../shelf-content';
export default {
	name: 'shelf',
	components: { ShelfContent },
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
		};
	},
	computed: {
		variant() {
			return this.shelf.variations[0];
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
	methods: {},
};
