<template>
  <div class="level">
    <div class="level-item">
      <div class="field has-addons">
        <div class="control has-icons-left">
          <input class="input" type="text" placeholder="Search here" v-model="searchInput" />
          <span class="icon is-left">
            <font-awesome-icon icon="search" />
          </span>
        </div>
        <div class="control submit">
          <div class="button" :class="{ 'is-loading': searchIsLoading }" @click="executeSearch">
            <font-awesome-icon icon="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faSearch, faArrowRight);

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const searchStore = createNamespacedHelpers('search');

import useSearch from '@/compositions/search/search.js';

export default {
  components: {
    FontAwesomeIcon,
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
</style>
