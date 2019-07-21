export const formatAsset = (
	inputAsset,
	storeSlug,
	shelfSlug,
	variationSlug
) => {
	const isExternalAsset = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(
		inputAsset.src || inputAsset
	);
	let asset;
	if (isExternalAsset) {
		asset = inputAsset.src || inputAsset;
	} else {
		asset = getAssetsPath(storeSlug);
		asset += `${shelfSlug}/${variationSlug}/`;
		asset += inputAsset.src || inputAsset;
	}

	return { isExternalAsset, asset };
};

export const getAssetsPath = storeSlug => {
	let path = process.env.staticDir ? process.env.staticDir : '/';
	if (process.env.staticDir) {
		path += `${storeSlug}/`;
	}
	return path;
};
