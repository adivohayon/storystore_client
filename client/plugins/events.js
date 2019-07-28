import Vue from 'vue';

export default (ctx, inject) => {
	const EventBus = new Vue();

	inject('events', EventBus); // registers as this.$analytics
};

// import Vue from 'vue';

// Vue.prototype.$analytics = new Analytics('GTM-TQKQL2Z');
