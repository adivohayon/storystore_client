import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
	window.onNuxtReady(() => {
		new VuexPersistence({
			modules: ['cart', 'checkout'],
			/* your options */
		}).plugin(store);
	});
};
