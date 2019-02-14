export const getSlugFromHost = host => {
	const hostParts = host.split('.');
	const isDomain = hostParts.findIndex(item => item === 'storystore') > -1;
	const storeSlug = isDomain ? hostParts[0] : process.env.devStore;

	return storeSlug;
};
