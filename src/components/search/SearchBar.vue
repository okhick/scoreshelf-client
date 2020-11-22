<template>
  <div :class="['searchbar-wrapper', { 'hide-search': !searchbarIsShowing }]">
    <div class="search-spacer"></div>
    <div class="field has-addons search-field">
      <div class="control searchbox">
        <input
          class="input is-medium"
          type="text"
          placeholder="Seach here"
          v-model="searchInput"
          @keyup.enter="executeSearch"
        />
      </div>
      <div class="control search-submit">
        <a class="button is-info is-medium" @click="executeSearch">
          <font-awesome-icon icon="arrow-right" />
        </a>
      </div>
    </div>
    <div class="search-spacer"></div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faArrowRight);

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const searchStore = createNamespacedHelpers('search');

import useSearch from '@/compositions/search/search.js';

export default {
  components: {
    FontAwesomeIcon,
  },
  setup(_, context) {
    const { executeSearch, searchInput } = useSearch(context);
    const { searchbarIsShowing } = searchStore.useState(['searchbarIsShowing']);

    return {
      // ---- Data ----
      searchInput,
      searchbarIsShowing,
      // ---- Methods ----
      executeSearch,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.hide-search {
  transform: translateY(-110px);
}

.searchbar-wrapper {
  background-color: $tan-transp;
  height: 70px;
  display: flex;
  justify-content: center;
  margin-left: 60px; //width of sidebar
  margin-bottom: 36px; //length of input overflow
  overflow: visible;
  transition: transform 0.25s ease-in-out;
}

.search-field {
  margin-top: 45px;
}

.searchbox {
  background-color: $off-white;
  border-radius: 4px;
}
.searchbox input {
  box-shadow: 0px 0px 17px rgba(0, 0, 0, 0.25);
  border: 1.5px solid $maroon;
}
.searchbox input:hover,
.searchbox input:focus {
  border: 2px solid $maroon;
}
.search-spacer {
  min-width: 5%;
}
.button.is-info {
  box-shadow: 0px 0px 17px rgba(0, 0, 0, 0.25);
  background-color: $maroon;
}
.button.is-info:hover {
  background-color: $maroon;
}
</style>
