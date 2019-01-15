import '../../icons';
export default {
	props: {},
	data() {
		return {
			shelfInfo: [
				{
					tabLabel: 'על החנות',
					tabContent: 'אודות אודות אודות',
				},
				{
					tabLabel: 'תקנון',
					tabContent: 'תקנון תקנון תקנון',
				},
				{
					tabLabel: 'פרטיות',
					tabContent: 'צור קשר צור קשר צור קשר',
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
