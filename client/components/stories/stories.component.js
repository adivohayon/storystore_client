import HorizontalSlider from '@/components/horizontal-slider';
import Story from '@/components/stories/story';
import _get from 'lodash.get';
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
	},
	data() {
		return {
			currentStoryIndex: 0,
			currentSlideIndex: 0,
			showStory: false,
			clickAvailable: true,
		};
	},
	computed: {
		storyThumbnails() {
			return this.stories
				.filter(story => _get(story, 'variations[0].assets[0]', false))
				.map(story => {
					let asset = this.assetsPath;
					asset += `${story.slug}/${story.variations[0].slug}/`;
					asset += _get(story, 'variations[0].assets[0]', '');
					const name = _get(story, 'name', '');
					const price = _get(story, 'variations[0].price', 0);
					// return asset;
					return {
						asset,
						name,
						price,
					};
				});
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
	created() {},
	mounted() {},
	destroyed() {},
	methods: {
		goToSlide({ param, storyIndex }) {
			if (param === 'NEXT_SLIDE') {
				if (
					this.currentSlideIndex ===
					this.stories[storyIndex].variations.length - 1
				) {
					this.goToStory({ param: 'NEXT_STORY', storyIndex });
				} else {
					this.currentSlideIndex++;
					console.log('next slide', this.currentSlideIndex, storyIndex);
				}
			}

			if (param === 'PREVIOUS_SLIDE') {
				if (this.currentSlideIndex === 0) {
					this.goToStory({ param: 'PREVIOUS_STORY', storyIndex });
				} else {
					this.currentSlideIndex--;
					console.log('previous slide', this.currentSlideIndex, storyIndex);
				}
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
			// console.log('enter story', storyIndex);
		},
		goToStory({ param, storyIndex }) {
			if (param === 'NEXT_STORY') {
				if (this.currentStoryIndex === this.stories.length - 1) {
					this.exitStory();
				} else {
					this.currentSlideIndex = 0;
					this.currentStoryIndex++;
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
			setTimeout(() => {
				this.clickAvailable = true;
			}, 300);
			console.log('exit story');
		},
	},
};
