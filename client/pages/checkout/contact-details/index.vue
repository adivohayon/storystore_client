<!-- eslint-disable -->
<template>
	<div class="checkout-page checkout-page--contact-details page-content">
		<div class="checkout-page__header">
			<h3>פרטי משלוח והזמנה</h3>
			<nuxt-link :to="`/checkout/shipping-details`" class="checkout-page__back">
				<button class="btn">
					<icon name="chevron" :original="true" width="22" height="22"></icon>
				</button>
			</nuxt-link>
		</div>
		<form
			id="checkoutForm"
			class="checkout-page__form"
			:class="{ 'form-group--error': $v.invalid }"
			@submit.prevent="submit"
		>
			<h4>פרטי אישיים</h4>
			<div class="checkout-page__section">
				<div
					class="checkout-page__form-group checkout-page__form-group--multiple-columns"
				>
					<input
						placeholder="שם פרטי"
						class="checkout-page__input"
						id="border-left"
						:class="{
							error: !$v.personal.firstName.required && this.invalid,
						}"
						v-model.trim="$v.personal.firstName.$model"
					/>
					<input
						placeholder="שם משפחה"
						class="checkout-page__input"
						:class="{
							error: !$v.personal.lastName.required && this.invalid,
						}"
						v-model.trim="$v.personal.lastName.$model"
					/>
				</div>
				<div class="checkout-page__form-group">
					<input
						placeholder="כתובת מייל"
						type="email"
						class="checkout-page__input"
						:class="{
							error:
								(!$v.personal.email.required || !$v.personal.email.email) &&
								this.invalid,
						}"
						v-model.trim="$v.personal.email.$model"
					/>
				</div>
				<div class="checkout-page__form-group">
					<input
						placeholder="טלפון"
						type="tel"
						class="checkout-page__input"
						id="border-bottom"
						:class="{
							error: !$v.personal.phone.required && this.invalid,
						}"
						v-model.trim="$v.personal.phone.$model"
					/>
				</div>
			</div>
		</form>
		<order-summary :shipping-address="shippingAddress"></order-summary>
		<div class="checkout-page__next-btn">
			<button id="checkout-submit" @click="completeCheckout">
				לתשלום מאובטח
			</button>
		</div>
		<checkout-order></checkout-order>
	</div>
</template>
<script>
import _get from 'lodash/get';
import { required, numeric, email } from 'vuelidate/lib/validators';
import CheckoutOrder from '@/components/checkout-order';
import OrderSummary from '@/components/order-summary';
export default {
	components: { CheckoutOrder, OrderSummary },
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	async asyncData() {},
	validations: {
		personal: {
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
		},
	},
	data() {
		return {
			personal: null,
			invalid: false,
		};
	},
	computed: {
		statePersonal: {
			get() {
				return _get(this.$store.state, 'checkout.personal', null);
			},
			set(details) {
				this.$store.commit('checkout/setPersonalDetails', details);
			},
		},
		storeSlug() {
			return _get(this.$store.state, 'store.slug', null);
		},
		shippingAddress() {
			const shippingDetails = _get(
				this.$store.state,
				'checkout.shippingDetails',
				{}
			);
			let addressStr = '';
			if (shippingDetails.street) addressStr += shippingDetails.street + ' ';
			if (shippingDetails.houseNumber)
				addressStr += shippingDetails.houseNumber + ', ';
			if (shippingDetails.city) addressStr += shippingDetails.city + ', ';
			if (shippingDetails.apptNumber)
				addressStr += `דירה ${shippingDetails.apptNumber} `;
			if (shippingDetails.floor) addressStr += `קומה ${shippingDetails.floor}`;

			return addressStr;
		},
	},
	watch: {
		statePersonal: function(newVal) {
			this.personal = { ...newVal };
		},
	},
	mounted() {
		if (!this.personal) {
			this.personal = { ...this.statePersonal };
		}
	},
	methods: {
		async completeCheckout() {
			try {
				this.$v.$touch();
				if (this.$v.$invalid) {
					this.invalid = true;
					return;
				}
				this.invalid = false;
				this.statePersonal = this.personal;
				const items = this.$store.getters['cart/items'](this.storeSlug);
				const paymentUrl = await this.$store.dispatch(
					'checkout/checkout',
					this.storeSlug
				);

				console.log('paymentUrl', paymentUrl);
				this.$store.dispatch('toggleLoader', true);
				window.location.href = paymentUrl;
			} catch (err) {
				console.error('Checkout error', err);
			}
		},
	},
};
</script>

<style src="./../checkout.page.scss" scoped lang="scss"></style>
