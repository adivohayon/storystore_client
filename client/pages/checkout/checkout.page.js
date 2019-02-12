import { required, numeric, email } from 'vuelidate/lib/validators';
export default {
	components: {},
	async asyncData({ params }) {},
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
				numeric,
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
		storeSlug() {
			return this.$store.state.store.slug;
		},
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
		submit() {
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
		},
	},
};
