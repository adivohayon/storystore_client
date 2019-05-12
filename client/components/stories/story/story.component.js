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
		return {};
	},
	computed: {
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
	mounted() {},
	methods: {
		nextSlide() {
			console.log('nextSlide');
			this.$emit('go-to-slide', {
				param: 'NEXT_SLIDE',
				storyIndex: this.storyIndex,
			});
			// if (this.currentSlideIndex === this.story.variations.length - 1) {
			// } else {
			// 	console.log('next slide');
			// 	this.currentSlideIndex++;
			// }
		},
		previousSlide() {
			this.$emit('go-to-slide', {
				param: 'PREVIOUS_SLIDE',
				storyIndex: this.storyIndex,
			});
			// if (this.currentSlideIndex === 0) {
			// } else {
			// 	console.log('previous slide');
			// 	this.currentSlideIndex--;
			// }
		},
	},
};
