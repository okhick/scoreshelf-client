export const search = {
  namespaced: true,
  state: {
    searchIsLoading: false,
    searchListingData: [],
    searchResultsMeta: {},
  },
  mutations: {
    toggleSearchIsLoading(state) {
      state.searchIsLoading = !state.searchIsLoading;
    },
    addSearchListingData(state, payload) {
      state.searchListingData = payload;
    },
    addSearchResultsMeta(state, payload) {
      state.searchResultsMeta = payload;
    },
    resetSearchStore(state) {
      state.searchListingData = [];
      state.searchResultsMeta = {};
    },
  },
};
