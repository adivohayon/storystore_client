export const formatAsset = (
	inputAsset,
	storeSlug,
	shelfSlug,
	variationSlug
) => {
	const isExternalAsset = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(
		inputAsset
	);
	let asset;
	if (isExternalAsset) {
		asset = inputAsset;
	} else {
		asset = getAssetsPath(storeSlug);
		asset += `${shelfSlug}/${variationSlug}/`;
		asset += inputAsset;
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
