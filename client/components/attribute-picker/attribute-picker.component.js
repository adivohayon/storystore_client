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
			setAttDeferredClick: false,
			sizeError: false,
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
			// return this.onlyOneSize || this.oneValueAndNull;
			return this.oneValueAndNull;
		},
		oneValueAndNull() {
			return (
				this.attribute.available.length === 1 &&
				!this.attribute.available[0].value
			);
		},
		onlyOneSize() {
			return (
				this.attKey.includes('size') &&
				this.attribute.available.length === 1 &&
				(this.attribute.available[0].value === 'OS' ||
					this.attribute.available[0].value === 'OneSize')
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
		async setAtt(att) {
			console.log('change att', att, this.attKey);
			this.$emit('changed-att', {
				att,
				attKey: this.attKey,
			});
		},
	},
};
