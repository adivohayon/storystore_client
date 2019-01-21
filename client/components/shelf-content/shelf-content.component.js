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
		}
	},
	computed: {},
	created() {},
	mounted() {
		this.playerOptions.sources[0].src = this.content.value;
	},
	methods: {},
};
