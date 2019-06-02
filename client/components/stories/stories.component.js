import HorizontalSlider from '@/components/horizontal-slider';
import Story from '@/components/stories/story';
import _get from 'lodash.get';
import _orderBy from 'lodash.orderby';
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
			return _orderBy(this.story.variations, ['variation_order'], ['asc']);
		},
		storyThumbnails() {
			const thumbnails = [];
			for (const story of this.stories) {
				const variations = _orderBy(
					story.variations,
					['variation_order'],
					['asc']
				);
				if (variations[0] && variations[0].assets && variations[0].assets[0]) {
					let asset = this.assetsPath;
					asset += `${story.slug}/${variations[0].slug}/`;
					asset += variations[0].assets[0];
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

			// return this.stories
			// 	.filter(story => _get(story, 'variations[0].assets[0]', false))
			// 	.map(story => {
			// 		let asset = this.assetsPath;
			// 		asset += `${story.slug}/${story.variations[0].slug}/`;
			// 		asset += _get(story, 'variations[0].assets[0]', '');
			// 		const name = _get(story, 'name', '');
			// 		const price = _get(story, 'variations[0].price', 0);
			// 		// return asset;
			// 		return {
			// 			asset,
			// 			name,
			// 			price,
			// 		};
			// 	});
		},
		assetsPath() {
			let path = process.env.staticDir ? process.env.staticDir : '/';
			if (process.env.staticDir) {
				path += `${this.storeSlug}/`;
			}
			return path;
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
				if (
					this.currentSlideIndex ===
					this.stories[storyIndex].variations.length - 1
				) {
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

			this.$analytics.productView(
				this.stories[storyIndex].slug,
				this.stories[storyIndex].variations[this.currentSlideIndex].slug
			);
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
