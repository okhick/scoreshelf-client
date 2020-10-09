<template>
  <div class="columns">
    <div class="column is-1"></div>

    <loading
      :active.sync="searchIsLoading"
      :can-cancel="false"
      :is-full-page="false"
    >
    </loading>

    <div class="column">
      <div>
        <p>
          <b>Search results for:</b>
          {{ decodeURIComponent($route.params.query) }}
        </p>
        <p><b>Total results:</b> {{ searchResultsMeta.totalItems }}</p>
      </div>
      <div class="searchResults">
        <search-result v-for="listing in searchListingData" :key="listing.id.uuid" v-bind:listing="listing" />        
      </div>
    </div>
    
    <div class="column is-1"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { sharetribe } from "../mixins/sharetribe";
import SearchResult from "../components/search/SearchResult";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [sharetribe],
  components: {
    Loading,
    SearchResult
  },
  computed: {
    ...mapState({
      // SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      searchIsLoading: state => state.search.searchIsLoading,
      searchListingData: state => state.search.searchListingData,
      searchResultsMeta: state => state.search.searchResultsMeta
    })
  }
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