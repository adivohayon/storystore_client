import _get from 'lodash/get';
import { validateEmail } from '@/helpers/validation.helpers';
export default {
	name: 'checkout-response',
	components: {},
	props: {},
	data() {
		return {
			show: false,
		};
	},
	async mounted() {
		if (this.orderQuery === 'error') {
			setTimeout(() => {
				this.toggle();
			}, 1500);
		}

		if (
			this.orderQuery === 'success' &&
			this.orderId &&
			this.orderEmail &&
			validateEmail(this.orderEmail)
		) {
			setTimeout(() => {
				this.toggle();
			}, 1500);
			await this.$axios.$post('order/new-order-email', {
				to: this.orderEmail,
				orderId: this.orderId,
			});
		}
	},
	computed: {
		orderEmail() {
			return _get(this.$route, 'query.orderEmail', null);
		},
		orderId() {
			return _get(this.$route, 'query.orderId', null);
		},
		orderNumber() {
			return `6700${this.orderId}`;
		},
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
		message() {
			if (this.orderQuery) {
				if (this.orderQuery === 'success') {
					return `הזמנתך התקבלה בהצלחה והיא בדרך אליך. אישור ההזמנה ישלח אליך למייל ${
						this.orderEmail
					}`;
				}

				if (this.orderQuery === 'error') {
					return `כרטיס האשראי שלך לא חויב. אנא נסו שוב או צרו איתנו קשר לבירור נוסף ב-`;
				}
			}
		},
	},
	methods: {
		close() {
			this.$router.replace({ query: {} });
			this.toggle();
		},
		toggle() {
			this.show = !this.show;
		},
	},
};
