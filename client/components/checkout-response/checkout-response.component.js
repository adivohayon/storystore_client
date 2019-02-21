import _get from 'lodash/get';
export default {
	name: 'checkout-response',
	components: {},
	props: {},
	data() {
		return {
			show: false,
		};
	},
	mounted() {
		if (this.orderQuery === 'success' || this.orderQuery === 'error') {
			setTimeout(() => {
				this.toggle();
			}, 1500);
		}
	},
	computed: {
		orderQuery() {
			return this.$route.query.order;
		},
		title() {
			if (this.storeName) {
				if (this.orderQuery === 'success') {
					return `תודה שהזמנת ב - ${this.storeName}!`;
				}
				if (this.orderQuery === 'error') {
					return 'העסקה נכשלה';
				}
			}
		},
		storeName() {
			return _get(this.$store.state, 'store.name', null);
		},
		storePhone() {
			return _get(this.$store.state, 'store.info.phone', null);
		},
		customerEmail() {
			return 'adivohayon@gmail.com';
		},
		orderNumber() {
			return '767689';
		},
		message() {
			if (this.orderQuery) {
				if (this.orderQuery === 'success') {
					return 'הזמנתך התקבלה בהצלחה והיא בדרך אליך';
				}

				if (this.orderQuery === 'error') {
					return `כרטיס האשראי שלך לא חויב. אנא נסו שוב או צרו איתנו קשר לבירור נוסף ב-`;
				}
			}
		},
	},
	methods: {
		toggle() {
			this.show = !this.show;
		},
	},
};
