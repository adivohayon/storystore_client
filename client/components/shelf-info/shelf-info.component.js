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
					tabContent:
						'מהרגע שהזמנת-החבילה תצא אליך בתוך 1-2 ימי עסקים. במידה ולחצת על אופצייה של דואר רשום, לוקח בין יומיים לשבועיים להזמנה המהממת שלך להגיע! המשלוח ימתין לך בסניף הדואר הקרוב לביתך. בהזמנה שנכנס למעטפה רגילה, החבילה תישלח אלייך ישירות לבית! ',
				},
				{
					tabLabel: 'החזרות',
					tabContent: 'החזרות החזרות החזרות',
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
