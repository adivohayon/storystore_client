export default {
	name: 'attribute-picker',
	components: {},
	props: {
		attribute: {
			type: Object,
			default() {
				return {};
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
		isColor() {
			return this.attKey.includes('color');
		},
		selectedAttIndex() {
			return this.attribute.available.findIndex(
				attr => attr.value === this.selectedAttribute.value
			);
		},
		hidePicker() {
			return this.onlyOneSize;
		},
		onlyOneSize() {
			return (
				this.attKey === 'size' &&
				this.attribute.available.length === 1 &&
				this.attribute.available[0].value === 'OS'
			);
		},
	},
	watch: {
		selectedAttIndex: function(newVal) {
			if (newVal === -1) {
				this.setAtt(this.attribute.available[0]);
			}
		},
	},
	created() {},
	mounted() {},
	methods: {
		setAtt(att) {
			this.$emit('changed-att', {
				att,
				attKey: this.attKey,
			});
		},
	},
};
