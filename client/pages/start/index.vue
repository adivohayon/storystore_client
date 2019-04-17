<template src="./start.page.html"></template>
<script>
import '@/icons/checkmark';
import { contactStorystore } from '@/services/api.service';
import { validateEmail } from '@/helpers/validation.helpers';
export default {
	components: {},
	async asyncData({ params, store }) {
		store.commit('toggleLoader', false);
	},
	data() {
		return {
			contactFormResp: {
				text: null,
				class: null,
			},
			formData: {
				companyName: null,
				companyUrl: null,
				contactName: null,
				contactPhone: null,
				contactEmail: null,
			},
			validationErrors: {
				contactEmail: false,
			},
			features: [
				'ללא עלות הקמה',
				'ממשק קל ונוח לתפעול ולשליטה',
				'יותר מוצרים בפחות זמן - יחס המרה גבוה יותר',
				'חווית משתמש ייחודית וחברתית',
				'דגש על המוצרים ואיכות התוכן  (וידאו, תמונות וטקסטים)',
				'ליווי מקצועי צמוד של הצוות של סטורי סטור',
			],
			studioFeatures: [
				'בניית קונספט',
				'צילום ובימוי',
				'סטודיו וציוד מקצועי',
				'דוגמנים/יות במידת הצורך',
				'הלבשה סטיילנג ואיפור',
				'עריכה ופוסט',
			],
		};
	},
	computed: {
		staticDir() {
			return process.env.staticDir || '/';
		},
		// email() {
		// 	// return this.formData.contactEmail;
		// 	return '';
		// },
	},
	watch: {
		// 'formData.contactEmail': (newEmail, oldVal) => {
		// 	if (newEmail) {
		// 		this.validationErrors.contactEmail = validateEmail(newEmail);
		// 	}
		// },
	},

	mounted() {},
	methods: {
		resetContactForm() {
			this.formData = {
				companyName: null,
				companyUrl: null,
				contactName: null,
				contactPhone: null,
				contactEmail: null,
			};
			this.validationErrors.contactEmail = false;
		},
		async submitForm() {
			try {
				// if (this.formData.email)
				if (validateEmail(this.formData.contactEmail)) {
					const resp = await contactStorystore(this.formData);
					this.contactFormResp.text = 'ההודעה נשלחה. נחזור אליכם בהקדם!';
					this.contactFormResp.class = 'contact-form__resp--success';
					this.resetContactForm();
					console.log('resp', resp);
				} else {
					this.validationErrors.contactEmail = true;
					this.contactFormResp.text = 'כתובת המייל שהזנת לא תקין';
					this.contactFormResp.class = 'contact-form__resp--error';
					//throw new Error('Email not valid');
				}
				// const { res } = await axios.post('/api/nodemailer', {
				// 	emailInfo,
				// 	emailProvider,
				// });
				// alert('Message send successfully');
			} catch (error) {
				this.contactFormResp.text =
					'הייתה שגיאה בלשלוח את ההודעה. נסו להתקשר אלינו בינתיים ונפתור את הבעיה בהקדם.';
				this.contactFormResp.class = 'contact-form__resp--error';
				console.error(error);
			}
		},
	},
};
</script>

<style src="./start.page.scss" lang="scss"></style>
