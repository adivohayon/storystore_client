export const getSubdomainFromHost = host => {
	if (host === 'localhost') {
		return process.env.devStore;
	}

	const hostParts = host.split('.');
	const isDomain = hostParts.findIndex(item => item === 'storystore') > -1;
	let subdomain = isDomain ? hostParts[0] : process.env.devStore;

	// console.log('subdomain', subdomain);
	if (subdomain === 'www' || subdomain === 'storystore') {
		subdomain = 'stores';
	}
	return subdomain;
};
