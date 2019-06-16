export const getFileExtension = filename => {
	return filename.split('.').pop();
};

export const getFilenameWithoutExtension = filename => {
	return filename
		.split('.')
		.slice(0, -1)
		.join('.');
};
