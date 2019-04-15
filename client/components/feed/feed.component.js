// import scrollSnapPolyfill from 'css-scroll-snap-polyfill';

export default {
	name: 'feed',
	components: {},
	props: [],
	data() {
		return {
			// snapObject: null,
			// snapConfig: {
			// 	scrollSnapDestination: '0% 100%',
			// 	scrollTimeout: 30, // *OPTIONAL* (default = 100) time in ms after which scrolling is considered finished
			// 	scrollTime: 500, // *OPTIONAL* (default = 300) time in ms for the smooth snap
			// },
		};
	},
	computed: {},
	created() {},
	mounted() {
		const scrollSnapPolyfill = require('css-scroll-snap-polyfill');
		scrollSnapPolyfill();
		// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		// Then we set the value in the --vh custom property to the root of the document
	},
	methods: {},
};
