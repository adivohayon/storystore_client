import { Analytics } from './../services/analytics.service';

export default (ctx, inject) => {
	const analytics = new Analytics('GTM-TQKQL2Z');

	inject('analytics', analytics); // registers as this.$analytics
};

// import Vue from 'vue';

// Vue.prototype.$analytics = new Analytics('GTM-TQKQL2Z');
