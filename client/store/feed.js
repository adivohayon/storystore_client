export const state = () => ({
	shelves: [],
});

export const mutations = {
	add(state, shelf) {
		state.shelves.push(shelf);
	},
	populate(state, shelves) {
		state.shelves = shelves;
	},
};

const useMockData = process.env.USE_MOCK_DATA;
export const actions = {
	async get({ commit }, storeSlug) {
		try {
			console.log('USE_MOCK_DATA', useMockData);
			const shelves = useMockData
				? (await import(`@/mocks/shelves.${storeSlug}.json`)).default
				: (await this.$axios.$get(`stores/${storeSlug}/shelves`)).data;

			console.log('resp', shelves);
			commit('populate', shelves);
			// console.log('resp', resp.data);
		} catch (err) {
			console.error('Store / Shelves / Dispatch get / Error', err);
		}
	},
};
