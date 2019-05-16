<template>
	<div class="page checkout-page checkout-page--shipping-options">
		<div class="checkout-page__header">
			<h3>פרטי משלוח והזמנה</h3>
			<nuxt-link :to="`/cart`" class="checkout-page__back">
				<button class="btn">
					<icon :original="true" name="chevron" width="22" height="22"></icon>
				</button>
			</nuxt-link>
		</div>
		<div class="shipping-options">
			<h4>אפשרויות משלוח</h4>
			<div v-if="shippingOptions.length > 0" class="checkout-page__section">
				<div
					v-for="(option, optionIndex) in shippingOptions"
					:key="optionIndex"
					class="checkout-page__radio-group"
				>
					<div class="checkout-page__radio-group__radio">
						<input v-model="selectedShipping" :value="option" type="radio" />
					</div>
					<div class="checkout-page__radio-group__details">
						<h5>{{ option.price }} {{ currency }} - {{ option.type }}</h5>
						<div class="shipping-options__eta">
							{{ option.eta }}
						</div>
					</div>
				</div>
			</div>
			<order-summary></order-summary>
			<div class="checkout-page__next-btn">
				<button id="checkout-submit" @click="goToShippingDetails">
					להזנת פרטי המשלוח
				</button>
			</div>
			<checkout-order></checkout-order>
			<!-- <div class="complete-checkout">
				<nuxt-link to="/checkout/shipping-details">
					<button id="checkout-submit">
						להזנת פרטי המשלוח
					</button>
				</nuxt-link>
			</div> -->
		</div>
	</div>
</template>
<script>
import _get from 'lodash/get';
import PageHeader from '@/components/page-header';
import CheckoutOrder from '@/components/checkout-order';
import OrderSummary from '@/components/order-summary';
import { checkoutMixin } from '@/helpers/mixins';
import { checkRule } from '@/helpers/rules.helpers';
export default {
	components: { PageHeader, CheckoutOrder, OrderSummary },
	async asyncData() {},
	mixins: [checkoutMixin],
	layout(ctx) {
		return ctx.app.isMobile ? 'mobile' : 'desktop';
	},
	data() {
		return {};
	},
	computed: {
		shippingOptions() {
			const options = _get(this.$store.state, 'store.shippingOptions', []);

			// return options.filter(option => option)
			const freeOptions = [];
			const alwaysShowOptions = [];
			const paidOptions = [];
			const parsedOptions = [];
			// const freeOptions = options.filter(v => v.price === 0);
			for (const option of options) {
				// Free option

				// SUBTOTAL CONDITION
				if (
					option.condition &&
					option.condition.type &&
					option.condition.type === 'subtotal'
				) {
					const price = checkRule(option.condition, this.subtotal)
						? 0
						: option.price;

					parsedOptions.push({
						condition: option.condition,
						type: option.type,
						eta: option.eta,
						price,
					});

					continue;
				}
				// }

				// Always SHOW
				if (
					option.condition &&
					option.condition.type &&
					option.condition.type === 'always_show'
				) {
					alwaysShowOptions.push(option);
					continue;
				}
			}
			console.log('freeOptions', freeOptions);
			console.log('alwaysShowOptions', alwaysShowOptions);
			return [...parsedOptions, ...alwaysShowOptions];
		},
		selectedShipping: {
			get() {
				return _get(this.$store.state, 'checkout.shippingOption', {});
			},
			set(shippingOption) {
				this.$store.commit('checkout/setShippingOption', shippingOption);
			},
		},
		currency() {
			return '₪';
		},
		storeSlug() {
			return _get(this.$store.state, 'store.slug', null);
		},
		subtotal() {
			return this.$store.getters['cart/subtotal'](this.storeSlug);
		},
	},
	mounted() {
		setTimeout(() => {
			this.selectedShipping = this.shippingOptions[0];
		}, 50);
	},
	methods: {
		goToShippingDetails() {
			this.$router.push('/checkout/shipping-details');
		},
	},
};
</script>

<style src="./../checkout.page.scss" scoped lang="scss"></style>
