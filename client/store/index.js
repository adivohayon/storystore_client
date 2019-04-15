import { getSlugFromHost } from '@/helpers/async-data.helpers';
export const state = () => ({
	loader: {
		show: false,
		hideElements: false,
	},
});
export const mutations = {
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

	async nuxtServerInit({ dispatch }, { req, redirect, error, route }) {
		const host = process.server ? req.headers.host : window.location.hostname;
		const storeSlug = getSlugFromHost(host);

		// const hostsParts = req.headers.host.split('.');
		// const isDomain = hostsParts.findIndex(item => item === 'storystore') > -1;

		// const storeSlug = isDomain ? hostsParts[0] : process.env.DEV_STORE;
		const isWebsiteRoot = storeSlug === 'storystore' || storeSlug === 'www';

		if (isWebsiteRoot) {
			console.log('Website root | Route:', route.name);
			if (route.name === 'index') {
				return redirect('/start');
			}
			if (route.name === 'start') {
				return;
			}

			return error('404');
		} else {
			// If we try /start we should get a 404 to prevent duplicates on subdomains
			if (route.name === 'start') {
				return error('404');
			}

			console.log('storeSlug', storeSlug);
			// Not website root let's check for store
			const fetchStoreResp = await dispatch('store/get', storeSlug);
			if (!fetchStoreResp) {
				console.log(`'${storeSlug}' store was not found`);
				return error('החנות לא נמצאה');
			}
			// console.log('fetchStoreResp', fetchStoreResp);
		}

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
};

// export const strict = false;
