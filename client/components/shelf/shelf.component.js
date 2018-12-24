export default {
	name: 'shelf',
	components: {},
	props: [],
	data() {
		return {
			swiper: null,
		};
	},
	computed: {},
	created() {},
	mounted() {
		this.swiper = new this.$Swiper('.swiper-container', {
			// Optional parameters
			direction: 'horizontal',
			loop: true,

			// If we need pagination
			pagination: {
				el: '.swiper-pagination',
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
