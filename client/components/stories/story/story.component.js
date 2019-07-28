import _get from 'lodash.get';
import _orderBy from 'lodash.orderby';
import StorySlide from '@/components/stories/story/story-slide';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

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
		storySlides: {
			type: Array,
			default() {
				return [];
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
			duration: 4500,
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
		promotionalMessage() {
			const integrationType = _get(
				this.$store.state,
				'store.settings.integrations.type',
				null
			);

			if (integrationType && integrationType === 'HOODIES_CUSTOM') {
				// if (
				// 	this.story.slug === 'mor-swide1-pro-3-4-basic-skinny' ||
				// 	this.story.slug === 'nelly1-pro-3-4-basic-skinny' ||
				// 	this.story.slug === 'alina-levi1-pro-3-4-legging' ||
				// 	this.story.slug === 'mor-dvir1-pro-3-4-legging' ||
				// 	this.story.slug === 'inbar-alexandernrin1-stormtrooper-pro-legging'
				// ) {
				// 	return {
				// 		text: '30% הנחה במילוי קוד קופון',
				// 		bgColor: '#D10303',
				// 		color: '#ffffff',
				// 	};
				// }
				const promotionMessage = _get(this.story.data, 'promotion', null);
				return promotionMessage;
			} else {
				return null;
			}
		},
		sortedVariations() {
			return _orderBy(this.story.variations, ['variation_order'], ['asc']);
		},
		// webpSupport() {
		// 	return Modernizr.webp;
		// },
		// storySlides() {
		// 	if (this.sortedVariations) {
		// 		// console.log('sortedVariations', this.sortedVariations);
		// 		const storySlides = [];
		// 		for (let variation of this.sortedVariations) {
		// 			const jpgAssets = variation.assets.filter(asset => {
		// 				if (this.webpSupport) {
		// 					return asset.src.includes('.webp');
		// 				}
		// 				return asset.src.includes('.jpg');
		// 			});

		// 			// console.log('jpgAssets', jpgAssets);
		// 			for (let asset of jpgAssets) {
		// 				(function() {
		// 					let variationClone = Object.assign({}, variation);
		// 					variationClone.assets = [asset];
		// 					storySlides.push(variationClone);
		// 				})();
		// 			}
		// 			// console.log('storySlides', storySlides);
		// 		}
		// 		return storySlides;
		// 	}
		// },
		paginationItems() {
			return this.storySlides.map(variation => {
				if (variation.itemProperty.type === 'fashion_simple_color') {
					return variation.property_value || '#ffffff';
				}
			});
		},
		// thumbnail() {
		// 	return this.assetsPath + _get(this.story, 'variations[0].assets[0]', '');
		// },
		// assetsPath() {
		// 	return getAssetsPath(this.storeSlug);
		// },
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	created() {},
	beforeDestroy() {
		console.log('STORY :: Close Story');
		// enable scrolling
		enableBodyScroll(this.$refs.storyView);
		this.$events.$emit('BLACK_BG', false);
	},
	mounted() {
		const vh = window.innerHeight * 0.01;
		// Then we set the value in the --vh custom property to the root of the document
		document.documentElement.style.setProperty('--vh', `${vh}px`);

		// turn of scrolling behind
		// this.$events.$emit('TOGGLE_SCROLL');
		disableBodyScroll(this.$refs.storyView);
		this.$events.$emit('BLACK_BG', true);
		// window.e;
		this.startProgress(this.currentSlideIndex);
	},

	methods: {
		goToStory(event) {
			console.log('story / goToStory', event);
			this.$emit('go-to-story', event);
		},
		closeStory() {
			this.$emit('close-story');
		},
		setProgress(progress, element) {
			this.lastProgress = progress;
			if (element && element.style) {
				element.style.width = progress + '%';
			}
		},

		startProgress(progressBarIndex, initial = 0) {
			// $refs.progressBars depends on a v-for loop of paginationItems
			if (!this.$refs.progressBars) {
				console.log(
					'STORY :: startProgress / no progressBars element',
					this.$refs.progressBars
				);
				return;
			}

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

		showStorySlide(variationIndex) {
			// if (!_get(this.story, `variations[${variationIndex}].assets[0]`, false)) {
			// 	return false;
			// }

			if (!_get(this.storySlides[variationIndex], 'assets[0]', false)) {
				return false;
			}

			return variationIndex === this.currentSlideIndex;
			// if (this.story.variations[variationIndex].assets[0])
		},
	},
};
