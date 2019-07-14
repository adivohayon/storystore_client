import { WooCommerce } from './../services/woocommerce.service';
export default (ctx, inject) => {
	console.log('process.client', process.client);
	// const analytics = new Analytics('GTM-TQKQL2Z');
	const cartIntegration = ctx.store.getters['cart/integration'];
	const integrations = {};
	if (cartIntegration && cartIntegration.connector === 'WOOCOMMERCE') {
		cartIntegration.service = new WooCommerce(
			cartIntegration.baseUrl,
			ctx.$axios
		);
		integrations.cart = cartIntegration;
	}
	console.log('integrations', integrations);
	// inject('analytics', analytics); // registers as this.$analytics
	inject('integrations', integrations);
};

// import Vue from 'vue';

// Vue.prototype.$analytics = new Analytics('GTM-TQKQL2Z');
