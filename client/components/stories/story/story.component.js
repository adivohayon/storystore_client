import _get from 'lodash.get';
import StorySlide from '@/components/stories/story/story-slide';
export default {
	name: 'story',
	components: { StorySlide },
	props: {
		story: {
			type: Object,
			default() {
				return {};
			},
		},
		currentSlideIndex: {
			type: Number,
			default: 0,
		},
		storyIndex: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			progressTickers: {
				0: null,
			},
			clickableAreaEl: null,
			hammer: null,
			lastProgress: 0,
			duration: 3000,
		};
	},
	watch: {
		currentSlideIndex: function(newVal, oldVal) {
			console.log('newVal', newVal);
			// if (newVal !== oldVal) {
			this.startProgress(newVal);
			// }
		},
	},
	computed: {
		paginationItems() {
			return this.story.variations.map(variation => {
				if (variation.itemProperty.type === 'fashion_simple_color') {
					return variation.property_value || '#ffffff';
				}
			});
		},
		thumbnail() {
			return this.assetsPath + _get(this.story, 'variations[0].assets[0]', '');
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}

			path += `${this.shelfSlug}/${this.variation.slug}/`;
			return path;
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	created() {},
	mounted() {
		this.startProgress(this.currentSlideIndex);
		this.clickableAreaEl = this.$refs.clickableArea;
		if (this.clickableAreaEl) {
			// const Hammer = this.$Hammer;
			this.hammer = new this.$Hammer.Manager(this.clickableAreaEl, {
				domEvents: true,
			});

			this.hammer.add(new Hammer.Press({ time: 251 }));
			this.hammer.add(new Hammer.Tap());
			// console.log('hammer', this.hammer);

			this.hammer.on('press', () => {
				this.toggleAutoplay('PAUSE');
			});

			this.hammer.on('pressup', () => {
				this.toggleAutoplay('RESUME');
			});

			this.hammer.on('tap', e => {
				// e.preventDefault();
				e.srcEvent.stopPropagation();
				e.srcEvent.preventDefault();
				const isNext = e.target.className.includes('__next');
				const isPrev = e.target.className.includes('__previous');

				if (isNext) {
					this.nextSlide();
				}

				if (isPrev) {
					this.previousSlide();
				}
				return;
			});
		}
	},
	destroyed() {
		this.hammer.destroy();
	},
	methods: {
		setProgress(progress, element) {
			this.lastProgress = progress;
			if (element && element.style) {
				element.style.width = progress + '%';
			}
		},

		startProgress(progressBarIndex, initial = 0) {
			const progressBar = this.$refs.progressBars[progressBarIndex];

			let progress = initial;

			this.setProgress(progress, progressBar);

			this.progressTickers[progressBarIndex] = setInterval(() => {
				if (progress >= 100) {
					// clearInterval(this.progressTickers[progressBarIndex]);
					this.nextSlide();
				} else {
					progress++;
					this.setProgress(progress, progressBar);
				}
			}, this.duration / 100);
		},
		convertHex(hex, opacity) {
			hex = hex.replace('#', '');
			if (hex === 'ffffff') {
				return '#d3d3d3';
			}
			const r = parseInt(hex.substring(0, 2), 16);
			const g = parseInt(hex.substring(2, 4), 16);
			const b = parseInt(hex.substring(4, 6), 16);

			const result =
				'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
			return result;
		},
		nextSlide() {
			this.setProgress(100, this.$refs.progressBars[this.currentSlideIndex]);
			this.clearTickers();
			this.$emit('go-to-slide', {
				param: 'NEXT_SLIDE',
				storyIndex: this.storyIndex,
			});
		},
		clearTickers() {
			for (let tickerIndex in this.progressTickers) {
				clearInterval(this.progressTickers[tickerIndex]);
			}
		},
		toggleAutoplay(toggle) {
			if (toggle === 'PAUSE') {
				this.clearTickers();
			}

			if (toggle === 'RESUME') {
				this.startProgress(this.currentSlideIndex, this.lastProgress);
			}
		},
		previousSlide() {
			this.setProgress(0, this.$refs.progressBars[this.currentSlideIndex]);
			this.clearTickers();
			this.$emit('go-to-slide', {
				param: 'PREVIOUS_SLIDE',
				storyIndex: this.storyIndex,
			});
		},
	},
};
