import _get from 'lodash/get';
import { required, numeric, email } from 'vuelidate/lib/validators';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
import { checkRule } from '@/helpers/rules.helpers';
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

		const checkoutDetails = JSON.parse(localStorage.getItem('checkoutDetails'));
		if (checkoutDetails) {
			this.order = checkoutDetails;
		}

		setTimeout(() => {
			this.selectedShipping = this.shippingOptions[0];
		}, 50);
	},
	computed: {
		items() {
			return this.$store.getters['cart/items'](this.storeSlug);
		},
		itemsImages() {
			const imgs = this.items.map(item => {
				return item.image;
			});
			return imgs;
		},
		shippingOptions() {
			const options = _get(this.$store.state, 'store.shippingOptions', []);

			// return options.filter(option => option)
			const freeOptions = [];
			const alwaysShowOptions = [];
			const paidOptions = [];
			// const freeOptions = options.filter(v => v.price === 0);
			for (const option of options) {
				// Free option
				if (option.price === 0) {
					if (
						option.condition &&
						option.condition.type &&
						option.condition.type === 'subtotal' &&
						checkRule(option.condition, this.subtotal)
					) {
						freeOptions.push(option);
						continue;
					}
				}
				// Always SHOW
				if (
					option.condition &&
					option.condition.type &&
					option.condition.type === 'always_show'
				) {
					alwaysShowOptions.push(option);
					continue;
				}

				// Paid option
				if (option.price > 0) {
					paidOptions.push(option);
					continue;
				}
			}

			if (freeOptions.length > 0) {
				return [...freeOptions, ...alwaysShowOptions];
			} else {
				return [...paidOptions, ...alwaysShowOptions];
			}
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		total() {
			if (this.subtotal) {
				if (this.selectedShipping && this.selectedShipping.price >= 0) {
					return this.subtotal + this.selectedShipping.price;
				} else {
					return this.subtotal;
				}
			} else {
				return 0;
			}
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
					localStorage.setItem('checkoutDetails', JSON.stringify(this.order));
					// do your submit logic here
					const customer = {
						first_name: this.order.firstName,
						last_name: this.order.lastName,
						phone: this.order.phone,
						email: this.order.email,
						shipping_address: `${this.order.street} ${this.order.houseNumber} ${
							this.order.apptNumber
						} ${this.order.floor}`,
						shipping_city: this.order.city,
						shipping_zip_code: this.order.zipCode,
					};

					const items = this.items.map(item => {
						return {
							variationId: item.variationId,
							variationAttributeIds: item.variationAttributeIds,
							qty: item.quantity,
						};
					});
					// return;
					this.selectedShipping.id = -1;
					const resp = await this.$axios.$post(`order`, {
						customer,
						items,
						shipping: this.selectedShipping,
					});

					if (!resp.url || resp.url === '') {
						throw new Error('URL returned from API is empty');
					}
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
							option.condition.rule,
							this.subtotal,
							option.condition.amount
						);
					case 'always_show':
						return true;
					default:
						return true;
				}
			} else {
				return true;
			}
		},
	},
};
