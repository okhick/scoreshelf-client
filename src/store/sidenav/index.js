export const sidenav = {
  namespaced: true,
  state: {
    isOpen: false
  },
  mutations: {
    toggleSidenav: function(state) {
      state.isOpen = !state.isOpen;
    },
    closeSidenav: function(state) {
      state.isOpen = false;
    }
  }
}