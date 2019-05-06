// import _get from 'lodash/get';
import { contactStorystore } from '@/services/api.service';
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
			fullName: {
				required,
			},
			businessName: {
				required,
			},
			mailAddress: {
				required,
				email,
			},
			phoneNumber: {
				required,
				numeric,
			},
		},
	},
	data() {
		return {
			formData: {},
			invalid: false,
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
				const resp = await contactStorystore(this.formData);
				console.log('submitForm resp', resp);
			} catch (err) {
				console.log('submitForm error', err);
			}
		},
	},
};
