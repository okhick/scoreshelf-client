export const search = {
  namespaced: true,
  state: {
    searchbarIsShowing: true,
    searchIsLoading: false,
    searchListingData: [],
    searchResultsMeta: {},
  },
  mutations: {
    toggleSearchbarIsShowing(state) {
      state.searchbarIsShowing = !state.searchbarIsShowing;
    },
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
