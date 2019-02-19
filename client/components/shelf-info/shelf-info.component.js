export default {
	name: 'shelf-info',
	components: {},
	props: {
		description: {
			type: String,
		},
		info: {
			type: String,
		},
		returns: {
			type: String,
		},
		shipping: {
			type: String,
		},
	},
	data() {
		return {
			shelfInfo: [
				{
					tabLabel: 'תיאור',
					tabContent: `<p>${this.info}</p>`,
				},
				{
					tabLabel: 'החזרות',
					tabContent: this.returns,
				},
				{
					tabLabel: 'משלוחים',
					tabContent: this.shipping,
				},
			],
			selectedTabIndex: 0,
		};
	},
	computed: {
		infoTabs() {
			return this.shelfInfo.map(shelfInfoItem => {
				return shelfInfoItem.tabLabel;
			});
		},
		tabContent() {
			if (this.shelfInfo[this.selectedTabIndex]) {
				return this.shelfInfo[this.selectedTabIndex].tabContent;
			}
		},
	},
	created() {},
	mounted() {},
	methods: {
		updateSelectedTabIndex(index) {
			this.selectedTabIndex = index;
		},
		closeInfo() {
			console.log('closeInfo');
			this.$emit('close-info');
		},
	},
};
