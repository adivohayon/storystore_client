<!-- eslint-disable -->
<template>
	<div class="checkout-page checkout-page--shipping-details page-content">
		<div class="checkout-page__header">
			<h3>פרטי משלוח והזמנה</h3>
			<nuxt-link :to="`/checkout/shipping-options`" class="checkout-page__back">
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
			<h4>פרטי משלוח</h4>
			<div class="checkout-page__form--section">
				<div class="checkout-page__form-group">
					<input
						:class="{
							error:
								!$v.shippingDetails.street.required &&
								this.invalid,
						}"
						v-model.trim="$v.shippingDetails.street.$model"
						placeholder="רחוב"
						class="checkout-page__input"
					/>
				</div>
				<div
					class="checkout-page__form-group checkout-page__form-group--multiple-columns"
				>
					<input
						id="border-left"
						:class="{
							error:
								(!$v.shippingDetails.houseNumber.required ||
									!$v.shippingDetails.houseNumber.numeric) &&
								this.invalid,
						}"
						v-model.trim="$v.shippingDetails.houseNumber.$model"
						placeholder="מספר בית"
						type="number"
						class="checkout-page__input"
					/>
					<input
						id="border-left"
						v-model.trim="$v.shippingDetails.apptNumber.$model"
						placeholder="מספר דירה"
						type="number"
						class="checkout-page__input"
					/>
					<input
						v-model.trim="$v.shippingDetails.floor.$model"
						placeholder="קומה"
						type="number"
						class="checkout-page__input"
					/>
				</div>
				<div id="border-bottom" class="checkout-page__form-group">
					<input
						id="border-left"
						:class="{
							error:
								!$v.shippingDetails.city.required &&
								this.invalid,
						}"
						v-model.trim="$v.shippingDetails.city.$model"
						placeholder="עיר"
						class="checkout-page__input"
					/>
				</div>
			</div>
		</form>
		<order-summary></order-summary>
		<div class="checkout-page__next-btn">
			<button id="checkout-submit" @click="submitShippingDetails">
				להזנת פרטים אישיים
			</button>
		</div>
		<checkout-order></checkout-order>
	</div>
</template>
<script>
import { required, numeric, email } from 'vuelidate/lib/validators';
import CheckoutOrder from '@/components/checkout-order';
import OrderSummary from '@/components/order-summary';
import _get from 'lodash/get';
export default {
	components: { CheckoutOrder, OrderSummary },
	async asyncData() {},
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	data() {
		return {
			invalid: false,
			shippingDetails: null,
		};
	},
	computed: {
		stateShippingDetails: {
			get() {
				return _get(this.$store.state, 'checkout.shippingDetails', null);
			},
			set(details) {
				this.$store.commit('checkout/setShippingDetails', details);
			},
		},
	},
	watch: {
		stateShippingDetails: function(newVal) {
			this.shippingDetails = { ...newVal };
		},
	},
	mounted() {
		if (!this.shippingDetails) {
			this.shippingDetails = { ...this.stateShippingDetails };
		}
	},
	methods: {
		submitShippingDetails() {
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.invalid = true;
				return;
			}
			this.invalid = false;

			this.stateShippingDetails = this.shippingDetails;
			this.$router.push('/checkout/contact-details');
		},
	},
	validations: {
		shippingDetails: {
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
				numeric,
			},
			floor: {
				numeric,
			},
		},
	},
};
</script>

<style src="./../checkout.page.scss" scoped lang="scss"></style>
