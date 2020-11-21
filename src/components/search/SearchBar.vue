<template>
  <div class="searchbar-wrapper">
    <div class="search-spacer"></div>
    <input class="input searchbox" type="text" placeholder="Text input" />
    <div class="search-spacer"></div>
  </div>
</template>

<script>
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// library.add(faSearch, faArrowRight);

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const searchStore = createNamespacedHelpers('search');

import useSearch from '@/compositions/search/search.js';

export default {
  components: {
    // FontAwesomeIcon,
  },
  setup(_, context) {
    const { executeSearch, searchInput } = useSearch(context);
    const { searchIsLoading } = searchStore.useState(['searchIsLoading']);

    return {
      // ---- Data ----
      searchIsLoading,
      searchInput,
      // ---- Methods ----
      executeSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
// .button {
//   color: $off-white;
//   background-color: $blue;
// }
// .button:hover {
//   color: $off-white;
//   // background-color: $tan;
// }
.searchbar-wrapper {
  background-color: $tan;
  height: 70px;
  display: flex;
  justify-content: center;
  margin-left: 60px; //width of sidebar
  overflow: visible;
}
.searchbox {
  background-color: $off-white;
  margin-top: 35px;
  min-height: 70px;
  max-width: 400px;
  border: 4px solid #953332;
  box-shadow: 0px 0px 17px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
.search-spacer {
  min-width: 5%;
}
</style>
