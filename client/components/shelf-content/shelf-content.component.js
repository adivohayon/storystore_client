import VideoPlayer from '@/components/video-player';
export default {
	name: 'shelf-content',
	components: { VideoPlayer },
	props: {
		content: {
			type: Object,
			default: () => {
				return {};
			},
		},
	},
	data() {
		return {
			playerOptions: {
				// videojs options
				muted: true,
				language: 'en',
				fluid: true,
				sources: [
					{
						type: 'video/mp4',
						src: '',
					},
				],
			},
		};
	},
	computed: {},
	created() {},
	mounted() {
		this.playerOptions.sources[0].src = this.content.value;
	},
	methods: {},
};
