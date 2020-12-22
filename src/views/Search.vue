<template>
  <div class="columns">
    <div class="column is-1"></div>

    <loading :active.sync="searchIsLoading" :can-cancel="false" :is-full-page="false"> </loading>

    <div class="column">
      <div>
        <p>
          <b>Search results for:</b>
          {{ decodeURIComponent($route.params.query) }}
        </p>
        <p><b>Total results:</b> {{ searchResultsMeta.totalItems }}</p>
      </div>
      <div class="searchResults">
        <search-result
          v-for="listing in searchListingData"
          :key="listing.id.uuid"
          v-bind:listing="listing"
        />
      </div>
    </div>

    <div class="column is-1"></div>
  </div>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import SearchResult from '../components/search/SearchResult';

import useSearch from '@/compositions/search/search';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

// import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
// const searchStore = createNamespacedHelpers('search'); // specific module name

export default {
  components: {
    Loading,
    SearchResult,
  },
  setup(_, context) {
    const {
      executeSearch,
      searchInput,
      searchIsLoading,
      searchListingData,
      searchResultsMeta,
    } = useSearch(context);

    onMounted(() => {
      // check if we're at a query route but there hasn't been a query
      const query = context.root.$route.params.query;
      if (query && Object.keys(searchResultsMeta.value).length === 0) {
        searchInput.value = query;
        executeSearch();
      }
    });

    return { searchIsLoading, searchListingData, searchResultsMeta };
  },
};
</script>

<style lang="css" scoped>
.searchResults {
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
