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
	},
	data() {
		return {
			currentStoryIndex: 0,
			currentSlideIndex: 0,
			showStory: false,
		};
	},
	computed: {
		storyThumbnails() {
			return this.stories.map(story => {
				let asset = this.assetsPath;
				asset += `${story.slug}/${story.variations[0].slug}/`;
				asset += _get(story, 'variations[0].assets[0]', '');
				return asset;
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
			this.currentStoryIndex = storyIndex;
			this.currentSlideIndex = 0;
			this.showStory = true;
			console.log('enter story', storyIndex);
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
					console.log('previous story', this.currentStoryIndex);
				}
			}
		},
		exitStory() {
			this.currentStoryIndex = 0;
			this.currentSlideIndex = 0;
			this.showStory = false;
			console.log('exit story');
		},
	},
};
