export default {
	name: 'attribute-picker',
	components: {},
	props: {
		attribute: {
			type: Array,
			default() {
				return [];
			},
		},
		attKey: {
			type: String,
		},
	},
	data() {
		return {
			selectedAttIndex: 0,
		};
	},
	computed: {},
	created() {},
	mounted() {},
	methods: {
		setAtt(att, attIndex) {
			this.selectedAttIndex = attIndex;
			this.$emit('changed-att', { att, attKey: this.attKey });
		},
	},
};
