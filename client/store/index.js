export const actions = {
	async nuxtServerInit({ dispatch }, { req, redirect, error, route }) {
		const param = req.headers.host.split('.')[0];
		const isWebsiteRoot = param === 'storystore' || param === 'www';

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

			// Not website root let's check for store
			const fetchStoreResp = await dispatch('store/get', param);
			if (!fetchStoreResp) {
				console.log(`'${param}' store was not found`);
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
