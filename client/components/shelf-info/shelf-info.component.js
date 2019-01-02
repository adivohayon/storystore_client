export default {
	name: 'shelf-info',
	components: {},
	props: {},
	data() {
		return {
			shelfInfo: [
				{
					tabLabel: 'תיאור',
					tabContent: 'תיאור תיאור תיאור',
				},
				{
					tabLabel: 'משלוחים',
					tabContent: 'משלוחים משלוחים משלוחים',
				},
				{
					tabLabel: 'החזרות',
					tabContent: 'החזרות החזרות החזרות',
				},
			],
			selectedTabIndex: Number,
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
