export const actions = {
	async nuxtServerInit({ dispatch }, { req, redirect, error }) {
		console.log('nuxtServerInit', req.headers.host);
		const param = req.headers.host.split('.')[0];
		// console.log('headers', req.headers);
		if (param === 'storystore' || 'www') {
			console.log('Storystore business page');
			redirect('/start');
		} else {
			console.log('Store:', param);
			const resp = await dispatch('store/get', param);
			if (!resp) {
				error('החנות לא נמצאה');
			}
			console.log('resp', resp);
		}
	},
};
