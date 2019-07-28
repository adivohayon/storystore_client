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
		// console.log('toggleLoader', state.loader.show);
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
	async nuxtServerInit({ dispatch }, { req, redirect, error, route, app }) {
		try {
			// console.log('nuxtServerInit');
			const host = process.server ? req.headers.host : window.location.hostname;
			const storeSlug = getSubdomainFromHost(host);
			console.log('nuxtServerInit / storeSlug', storeSlug);
			// console.log('context.error', error);
			const store = await dispatch('store/get', storeSlug);
			// console.log('nuxtServerInit / store', store);
		} catch (err) {
			// console.error('ERROR :: nuxtServerInit', err);
			return error(err);
		}
		// if (!fetchStoreResp) {
		// 	console.log(`'${storeSlug}' store was not found`);
		// 	return error('החנות לא נמצאה');
		// }

		// if (!app.isMobile) {
		// 	const desktopUrl = fetchStoreResp['desktop_url'];
		// 	if (desktopUrl) {
		// 		console.log('nuxtServerInit / Not mobile, redirecting to', desktopUrl);
		// 		return redirect(desktopUrl);
		// 	}
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
