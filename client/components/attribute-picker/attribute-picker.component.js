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
		selectedAttribute: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	data() {
		return {
			// selectedAttIndex: 0,
		};
	},
	computed: {
		selectedAttIndex() {
			return this.attribute.findIndex(
				attr => attr.value === this.selectedAttribute.value
			);
		},
		hidePicker() {
			return this.onlyOneSize;
		},
		onlyOneSize() {
			return (
				this.attKey === 'size' &&
				this.attribute.length === 1 &&
				this.attribute[0].value === 'OS'
			);
		},
	},
	created() {},
	mounted() {},
	methods: {
		setAtt(att, attIndex) {
			// this.selectedAttIndex = attIndex;
			this.$emit('changed-att', { att, attKey: this.attKey });
		},
	},
};
