import HorizontalSlider from '@/components/horizontal-slider';
import Story from '@/components/stories/story';
import _get from 'lodash.get';
import _orderBy from 'lodash.orderby';
import { getAssetsPath, formatAsset } from './../../helpers/assets.helpers';
export default {
	name: 'stories',
	components: { HorizontalSlider, Story },
	props: {
		stories: {
			type: Array,
			default: () => {
				return [];
			},
		},
		title: {
			type: String,
		},
		autostart: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			currentStoryIndex: 0,
			currentSlideIndex: 0,
			showStory: false,
			clickAvailable: true,
			hideEls: false,
		};
	},
	computed: {
		sortedVariations() {
			return _orderBy(
				this.stories[this.currentStoryIndex].variations,
				['variation_order'],
				['asc']
			);
		},
		storySlides() {
			if (this.sortedVariations) {
				console.log('sortedVariations', this.sortedVariations);
				const storySlides = [];
				for (let variation of this.sortedVariations) {
					for (let asset of variation.assets) {
						(function() {
							let variationClone = Object.assign({}, variation);
							variationClone.assets = [asset];
							storySlides.push(variationClone);
						})();
					}
					console.log('storySlides', storySlides);
				}
				return storySlides;
			}
		},
		storyThumbnails() {
			const thumbnails = [];
			for (const story of this.stories) {
				const variations = _orderBy(
					story.variations,
					['variation_order'],
					['asc']
				);

				const baseAsset = _get(variations[0], 'assets[0]', null);
				if (baseAsset) {
					const { asset } = formatAsset(
						baseAsset,
						this.storeSlug,
						story.slug,
						variations[0].slug
					);
					const name = _get(story, 'name', '');
					const price = variations[0].price || '';

					thumbnails.push({
						asset,
						name,
						price,
					});
				}
			}
			return thumbnails;
		},
		assetsPath() {
			return getAssetsPath(this.storeSlug);
		},
		storeSlug() {
			return this.$store.state.store.slug;
		},
	},
	created() {
		if (this.autostart) {
			this.hideEls = true;
		}
	},
	mounted() {
		if (this.autostart) {
			// this.hideEls = true;
			this.enterStory(0);
			// const variations = _orderBy(
			// 	this.stories[0].variations,
			// 	['variation_order'],
			// 	['asc']
			// );
			// this.$analytics.productView(variations[0].slug);
			// this.goToSlide('', 0);
			setTimeout(() => {
				this.$emit('started');
			}, 1300);
		}
	},
	destroyed() {},
	methods: {
		goToSlide({ param, storyIndex }) {
			if (param === 'NEXT_SLIDE') {
				if (this.currentSlideIndex === this.storySlides.length - 1) {
					this.goToStory({ param: 'NEXT_STORY', storyIndex });
					storyIndex++;
				} else {
					this.currentSlideIndex++;
					console.log('next slide', this.currentSlideIndex, storyIndex);
				}
			}

			if (param === 'PREVIOUS_SLIDE') {
				if (this.currentSlideIndex === 0) {
					this.goToStory({ param: 'PREVIOUS_STORY', storyIndex });
					storyIndex--;
				} else {
					this.currentSlideIndex--;
					console.log('previous slide', this.currentSlideIndex, storyIndex);
				}
			}

			if (this.stories[storyIndex].variations[this.currentSlideIndex]) {
				this.$analytics.productView(
					this.stories[storyIndex].slug,
					this.stories[storyIndex].variations[this.currentSlideIndex].slug
				);
			}
		},
		enterStory(storyIndex) {
			if (!this.clickAvailable) {
				return;
			}
			this.clickAvailable = false;

			this.currentStoryIndex = storyIndex;
			this.currentSlideIndex = 0;
			this.showStory = true;

			this.$analytics.productView(
				this.stories[storyIndex].slug,
				this.stories[storyIndex].variations[this.currentSlideIndex].slug
			);
			// console.log('enter story', storyIndex);
		},
		goToStory({ param, storyIndex }) {
			if (param === 'NEXT_STORY') {
				if (this.currentStoryIndex === this.stories.length - 1) {
					this.exitStory();
				} else {
					this.currentSlideIndex = 0;
					this.currentStoryIndex++;
					this.$emit('story-index-changed', this.currentStoryIndex);
					console.log('next story', this.currentStoryIndex);
				}
			}

			if (param === 'PREVIOUS_STORY') {
				if (this.currentStoryIndex === 0) {
					this.exitStory();
				} else {
					this.currentSlideIndex =
						this.stories[storyIndex - 1].variations.length - 1;

					this.currentStoryIndex--;
					this.$emit('story-index-changed', this.currentStoryIndex);
					console.log(
						'previous story currentSlideIndex',
						this.currentSlideIndex
					);
				}
			}
		},
		exitStory() {
			this.currentStoryIndex = 0;
			this.currentSlideIndex = 0;
			this.showStory = false;
			if (this.autostart) {
				this.hideEls = false;
			}
			setTimeout(() => {
				this.clickAvailable = true;
			}, 300);
			console.log('exit story');
		},
	},
};
