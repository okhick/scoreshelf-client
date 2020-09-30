<template>
  <div class="columns">
    <div class="column is-one-fifth"></div>

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
      <div>
        <table class="table" v-if="searchResultsMeta.totalItems > 0">
          <thead>
            <th>Title</th>
            <th>Price</th>
            <th>Composer</th>
            <th>Ensemble</th>
          </thead>
          <tbody>
            <tr v-for="listing in searchListingData" :key="listing.id.uuid">
              <td>{{ listing.attributes.title }}</td>
              <td>
                {{
                  listing.attributes.price
                    ? convertFromSharetribePrice(listing.attributes.price)
                    : "FREE"
                }}
              </td>
              <td>{{ listing.attributes.publicData.composer }}</td>
              <td>{{ listing.attributes.publicData.ensemble }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="column is-one-fifth"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { sharetribe } from "../mixins/sharetribe";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  mixins: [sharetribe],
  components: {
    Loading
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
</style>