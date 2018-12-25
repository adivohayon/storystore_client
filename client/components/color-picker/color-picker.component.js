export default {
	name: 'color-picker',
	components: {},
	props: {
		colors: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	data() {
		return {
			selectedColorIndex: 0,
		};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		setColor(color, colorIndex) {
			this.selectedColorIndex = colorIndex;
			this.$emit('switch-variant', { type: 'color', payload: color });
		},
	},
};
