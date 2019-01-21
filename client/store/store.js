export const state = () => ({
	slug: null,
});

export const mutations = () => ({
	setSlug(state, slug) {
		state.slug = slug;
	},
});
