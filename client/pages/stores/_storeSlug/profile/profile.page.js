import '@/icons';
export default {
	props: {},
	data() {
		return {
			profileTabs: ['על החנות', 'תקנון', 'שירות לקוחות'],
			profileContent: ['1', '2', '3'],
			selectedTabIndex: 0,
			storeName: null,
		};
	},
	computed: {
		tabContent() {
			return this.profileContent[this.selectedTabIndex];
		},
	},
	created() {},
	mounted() {
		this.storeName = this.$route.params.storeName;
	},
	methods: {
		updateSelectedTabIndex(index) {
			this.selectedTabIndex = index;
		},
	},
};
