import { required, numeric, email } from 'vuelidate/lib/validators';
import { getSlugFromHost } from '@/helpers/async-data.helpers';
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
			shippingOptions: [
				{
					price: 33,
					currency: '₪',
					label: 'שליח עד הבית',
					time: 'עד 3 ימי עסקים',
				},
				{
					price: 0,
					currency: '₪',
					label: 'שליח עד הבית',
					time: 'עד 3 ימי עסקים',
				},
			],
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
		kookintShippingOption() {
			return this.subtotal > 100
				? this.shippingOptions[1]
				: this.shippingOptions[0];
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
		total() {
			const total = this.subtotal + this.kookintShippingOption.price;
			return total;
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
					const resp = await this.$axios.$post(`order/${this.storeSlug}`, {
						personal,
						address,
						items,
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
	},
};
