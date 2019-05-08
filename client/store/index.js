import { getSubdomainFromHost } from '@/helpers/async-data.helpers';
export const state = () => ({
	loader: {
		show: false,
		hideElements: false,
	},
	showShelfInfo: false,
	currentShelfIndex: 0,
});
export const mutations = {
	toggleShelfInfo(state) {
		state.showShelfInfo = !state.showShelfInfo;
	},
	setCurrentShelfIndex(state, shelfIndex) {
		state.currentShelfIndex = shelfIndex;
	},
	toggleLoader(state, toggle) {
		if (typeof toggle === 'boolean') {
			state.loader.show = toggle;
		} else {
			state.loader.show = !state.loader.show;
		}
		console.log('toggleLoader', state.loader.show);
	},
	toggleLoaderHideElements(state, toggle) {
		if (typeof toggle === 'boolean') {
			state.loader.hideElements = toggle;
		} else {
			state.loader.hideElements = !state.loader.hideElements;
		}
	},
};
export const actions = {
	toggleHiddenLoader({ commit }, toggle) {
		commit('toggleLoaderHideElements', toggle);
		commit('toggleLoader', toggle);
	},
	toggleLoader({ commit }, toggle) {
		commit('toggleLoader', toggle);

		setTimeout(() => {
			commit('toggleLoader', false);
		}, 6000);
	},
	async nuxtServerInit({ dispatch }, { req, redirect, error, route }) {
		console.log('---nuxtServerInit---');
		const host = process.server ? req.headers.host : window.location.hostname;
		// console.log('nuxtServerInit subdomains', req);
		// console.log('host', host);
		const storeSlug = getSubdomainFromHost(host);

		console.log('storeSlug', storeSlug);
		// Not website root let's check for store
		const fetchStoreResp = await dispatch('store/get', storeSlug);
		if (!fetchStoreResp) {
			console.log(`'${storeSlug}' store was not found`);
			return error('החנות לא נמצאה');
		}
		// const hostsParts = req.headers.host.split('.');
		// const isDomain = hostsParts.findIndex(item => item === 'storystore') > -1;

		// const storeSlug = isDomain ? hostsParts[0] : process.env.DEV_STORE;
		// const isWebsiteRoot = storeSlug === 'storystore' || storeSlug === 'www';

		// if (isWebsiteRoot) {
		// console.log('Website root | Route:', route.name);
		// if (route.name === 'index') {
		// 	return redirect('/start');
		// }
		// if (route.name === 'start') {
		// 	return;
		// }

		// return error('404');
		// } else {
		// 	// If we try /start we should get a 404 to prevent duplicates on subdomains
		// 	if (route.name === 'start') {
		// 		return error('404');
		// 	}

		// console.log('fetchStoreResp', fetchStoreResp);
		// }

		// if (route.name === 'start' && !noSubdomain) {
		// 	error('404');
		// }

		// // console.log('headers', req.headers);
		// if (noSubdomain) {
		// } else {
		// 	console.log('Store:', param);
		// 	const resp = await dispatch('store/get', param);
		// 	if (!resp) {
		// 		error('החנות לא נמצאה');
		// 	}
		// 	console.log('resp', resp);
		// }
	},
	submitContactForm({}, formData) {
		return new Promise(async (resolve, reject) => {
			try {
				await this.$axios.$post('functions/submit-contact-form', {
					...formData,
				});
				console.log('success');
				resolve();
			} catch (err) {
				console.log(err);
				reject(err);
			}
		});
	},
};

// export const strict = false;
