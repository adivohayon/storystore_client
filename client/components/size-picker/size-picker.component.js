export default {
	name: 'size-picker',
	components: {},
	props: {
		sizes: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			selectedSizeIndex: 0,
		};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		setSize(size, sizeIndex) {
			this.selectedSizeIndex = sizeIndex;
			this.$emit('changed-size', size);
		},
	},
};
