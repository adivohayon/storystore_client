export default {
	name: 'video-player',
	components: {},
	props: {
		source: {
			type: String,
			default: '',
		},
	},
	data() {
		return {};
	},
	computed: {},
	created() {},
	mounted() {
		console.log('navigator', navigator);
		// this.video = this.$refs.videoEl;
		// this.video.play();
		// this.video.src = this.source;
		// this.video.load();
		// const playPromise = this.video.play();

		// if (playPromise !== undefined) {
		// 	playPromise
		// 		.then(_ => {
		// 			// Automatic playback started!
		// 			// Show playing UI.
		// 			console.log('playing....');
		// 		})
		// 		.catch(err => {
		// 			// Auto-play was prevented
		// 			// Show paused UI.
		// 			console.error('playing error', err);
		// 		});
		// }
		// console.log(this.video);
		// this.$refs.videoEl.src =
		// 	'http://iandevlin.github.io/mdn/video-player/video/tears-of-steel-battle-clip-medium.mp4';
		// this.$refs.videoEl.pause();
		// this.$refs.videoEl.load();
		// setTimeout(() => {
		// 	this.$refs.videoEl.play();
		// }, 0);
		// this.$refs.videoEl.play();
	},
	methods: {
		togglePlay() {
			if (this.$refs.videoEl.paused || this.$refs.videoEl.ended) {
				this.$refs.videoEl.play();
			} else {
				this.$refs.videoEl.pause();
			}
		},
	},
};
