export const actions = {
	async nuxtServerInit({ dispatch }, { req, redirect, error, route }) {
		const hostsParts = req.headers.host.split('.');
		const isDomain = hostsParts.findIndex(item => item === 'storystore') > -1;

		const storeSlug = isDomain ? hostsParts[0] : process.env.DEV_STORE;
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

export const strict = false;
