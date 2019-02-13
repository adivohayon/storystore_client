import { required, numeric, email } from 'vuelidate/lib/validators';
export default {
	components: {},
	async asyncData({ req }) {
		const hostsParts = req
			? req.headers.host.split('.')
			: window.location.hostname.split('.');
		const isDomain = hostsParts.findIndex(item => item === 'storystore') > -1;

		const storeSlug = isDomain ? hostsParts[0] : process.env.DEV_STORE;

		return {
			storeSlug,
		};
	},
	data() {
		return {
			order: {
				firstName: 'Adiv - Test',
				lastName: 'Ohayon - Test',
				phone: '052-5555555',
				email: 'adiv@test.com',
				city: 'Tel aviv',
				street: 'Main st.',
				houseNumber: 45,
				apptNumber: 10,
				floor: 2,
				zipCode: 90210,
				submitStatus: null,
			},
			shippingOptions: [
				{
					price: 33.0,
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
	mounted() {},
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
					this.submitStatus = 'PENDING';
					setTimeout(() => {
						this.submitStatus = 'OK';
					}, 500);
				}
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
			} catch (err) {
				console.error('err', err);
			}
		},
	},
};
