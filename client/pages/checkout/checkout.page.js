import _get from 'lodash/get';
import { required, numeric, email } from 'vuelidate/lib/validators';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
import { ruleCheck } from '@/helpers/rules.helpers';
export default {
	components: {},
	async asyncData({ req }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSlugFromHost(host);

		return {
			storeSlug,
		};
	},
	data() {
		return {
			order: {
				firstName: null,
				lastName: null,
				phone: null,
				email: null,
				city: null,
				street: null,
				houseNumber: null,
				apptNumber: null,
				floor: null,
				zipCode: null,
				submitStatus: null,
			},
			selectedShipping: {},
			// shippingOptions: [
			// 	{
			// 		price: 33,
			// 		currency: '₪',
			// 		label: 'שליח עד הבית',
			// 		time: 'עד 3 ימי עסקים',
			// 	},
			// 	{
			// 		price: 0,
			// 		currency: '₪',
			// 		label: 'שליח עד הבית',
			// 		time: 'עד 3 ימי עסקים',
			// 	},
			// ],
		};
	},
	validations: {
		order: {
			firstName: {
				required,
			},
			lastName: {
				required,
			},
			phone: {
				required,
			},
			email: {
				required,
				email,
			},
			city: {
				required,
			},
			street: {
				required,
			},
			houseNumber: {
				required,
				numeric,
			},
			apptNumber: {
				required,
				numeric,
			},
			floor: {
				required,
				numeric,
			},
			zipCode: {
				required,
				numeric,
			},
		},
	},
	mounted() {
		if (process.env.mockCheckout) {
			this.order = {
				firstName: 'Test: John',
				lastName: 'Test: Smith',
				phone: '111-222-333',
				email: 'adiv@shop-together.io',
				city: 'Test: Tel Aviv',
				street: 'Test: Alenby',
				houseNumber: 6,
				apptNumber: 7,
				floor: 16,
				zipCode: 90210,
				submitStatus: null,
			};
		}
	},
	computed: {
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		itemsImages() {
			const imgs = this.items.map(item => {
				return item.image;
			});
			console.log('imgs', imgs);
			return imgs;
		},
		// kookintShippingOption() {
		// 	return this.subtotal > 100
		// 		? this.shippingOptions[1]
		// 		: this.shippingOptions[0];
		// },
		shippingOptions() {
			const options = _get(this.$store.state, 'store.shippingOptions', []);

			const filtered = options.filter(this.showShippingOption);

			if (filtered.length) {
				this.selectedShipping = filtered[0];
				if (filtered[0].price === 0) {
					return [filtered[0]];
				}
				return filtered;
			}
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		total() {
			return this.subtotal + this.selectedShipping.price;
		},
		currency() {
			return '₪';
		},
	},
	methods: {
		async submit() {
			try {
				console.log('submit!');
				this.$v.$touch();
				if (this.$v.$invalid) {
					this.order.submitStatus = 'ERROR';
				} else {
					// do your submit logic here
					const personal = {
						firstName: this.order.firstName,
						lastName: this.order.lastName,
						phone: this.order.phone,
						email: this.order.email,
					};
					const address = {
						street:
							this.order.street +
							' ' +
							this.order.houseNumber +
							' ' +
							this.order.apptNumber +
							' ' +
							this.order.floor,
						city: this.order.city,
						zipCode: this.order.zipCode,
					};
					const items = this.items.map(item => {
						return {
							id: item.id,
							qty: item.quantity,
						};
					});

					this.selectedShipping.id = -1;
					const resp = await this.$axios.$post(`order/${this.storeSlug}`, {
						personal,
						address,
						items,
						shipping: this.selectedShipping,
					});

					console.log('***', resp);
					window.location.href = resp.url;
					this.submitStatus = 'PENDING';
					setTimeout(() => {
						this.submitStatus = 'OK';
					}, 500);
				}
			} catch (err) {
				console.error('err', err);
			}
		},
		showShippingOption(option) {
			if (option.condition) {
				// return option.condition
				switch (option.condition.type) {
					case 'subtotal':
						return ruleCheck(
							this.subtotal,
							option.condition.rule,
							option.condition.amount
						);
					default:
						return true;
				}
			} else {
				return true;
			}
		},
	},
};
