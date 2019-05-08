// import _get from 'lodash/get';
import { submitContactForm } from '@/services/api.service';
import { required, numeric, email } from 'vuelidate/lib/validators';
export default {
	name: 'contact-form',
	components: {},
	props: {
		submitted: {
			type: Boolean,
			default: false,
		},
	},
	validations: {
		formData: {
			name: {
				required,
			},
			company: {
				required,
			},
			email: {
				required,
				email,
			},
			phone: {
				required,
				numeric,
			},
		},
	},
	data() {
		return {
			formData: {
				name: null,
				company: null,
				email: null,
				phone: null,
			},
			invalid: false,
			success: false,
			error: false,
		};
	},
	watch: {
		submitted: function(newVal) {
			if (newVal) {
				this.submitForm();
			}
		},
	},
	computed: {},
	methods: {
		async submitForm() {
			try {
				console.log('submitForm', this.formData);
				this.$v.$touch();
				if (this.$v.$invalid) {
					this.invalid = true;
					return;
				}
				this.invalid = false;
				const resp = await this.$store.dispatch(
					'submitContactForm',
					this.formData
				);

				this.error = false;
				this.success = true;
				// console.log('submitForm resp', resp);
			} catch (err) {
				this.error = true;
				this.success = false;
				console.log('submitForm error', err);
			}
		},
	},
};
