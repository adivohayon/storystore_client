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
					return 'הזמנה לא התקבלה';
				}
			}
		},
		storeName() {
			return _get(this.$store.state, 'store.name', null);
		},
		customerEmail() {
			return 'adivohayon@gmail.com';
		},
		orderNumber() {
			return null;
		},
		message() {
			return `הזמנתך התקבלה בהצלחה, אישור ההזמנה ישלח אליך למייל djh@gmail.com 
			מספר ההזמנה: 789389
			`;
		},
	},
	methods: {
		toggle() {
			this.show = !this.show;
		},
	},
};
