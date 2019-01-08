import '../../icons';
export default {
	props: {},
	data() {
		return {
			shelfInfo: [
				{
					tabLabel: 'אודות',
					tabContent: 'תיאור תיאור תיאור',
				},
				{
					tabLabel: 'צור קשר',
					tabContent: 'משלוחים משלוחים משלוחים',
				},
				{
					tabLabel: 'תקנון',
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
