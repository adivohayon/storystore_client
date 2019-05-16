import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
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
			selectedTabIndex: 0,
			shelfInfo: [
				{
					tabLabel: 'תיאור',
					tabContent: this.info,
					showContent: true,
				},
				{
					tabLabel: 'החזרות',
					tabContent: this.returns,
					showContent: false,
				},
				{
					tabLabel: 'משלוחים',
					tabContent: this.shipping,
					showContent: false,
				},
			],
		};
	},
	computed: {
		infoTabs() {
			return this.shelfInfo.map(shelfInfoItem => {
				return shelfInfoItem.tabLabel;
			});
		},
	},
	created() {},
	mounted() {
		console.log('el', this.$refs);
		disableBodyScroll(this.$refs.shelfInfoComponent);
	},
	beforeDestroy() {
		enableBodyScroll(this.$refs.shelfInfoComponent);
	},
	methods: {
		getTabContent(index) {
			return this.shelfInfo[index].tabContent;
		},
		showTabContent(index) {
			return this.shelfInfo[index].showContent;
		},
		toggleShowContent(index) {
			console.log('toggleShowContent', index);
			this.shelfInfo[index].showContent = !this.shelfInfo[index].showContent;
		},
		// updateSelectedTabIndex(index) {
		// 	this.selectedTabIndex = index;
		// 	this.shelfInfo[index].showContent = !this.shelfInfo[index].showContent;
		// 	console.log('selectedTabIndex', this.selectedTabIndex);
		// },
		closeInfo() {
			console.log('closeInfo');
			this.$store.commit('toggleShelfInfo');
		},
	},
};
