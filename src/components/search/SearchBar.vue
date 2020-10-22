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
        <div class="control">
          <div class="button is-dark" :class="{ 'is-loading': searchIsLoading }" @click="doSearch">
            <font-awesome-icon icon="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faSearch, faArrowRight);

export default {
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      searchInput: '',
    };
  },
  computed: {
    ...mapState({
      SHARETRIBE: state => state.sharetribe.SHARETRIBE,
      searchIsLoading: state => state.search.searchIsLoading,
    }),
  },
  methods: {
    ...mapMutations('search', [
      'toggleSearchIsLoading',
      'addSearchListingData',
      'addSearchResultsMeta',
    ]),
    doSearch: async function() {
      this.toggleSearchIsLoading();
      const res = await this.SHARETRIBE.listings.query({
        keywords: this.searchInput,
      });
      this.$router.push({
        name: 'Search',
        params: { query: encodeURIComponent(this.searchInput) },
      });
      this.processSearchResults(res);

      // wait until the dom has reloaded to turn the toggle off
      this.$nextTick(() => {
        this.toggleSearchIsLoading();
      });
    },
    processSearchResults: function(rawRes) {
      const listingData = rawRes.data.data;
      const resMeta = rawRes.data.meta;
      this.addSearchListingData(listingData);
      this.addSearchResultsMeta(resMeta);
    },
  },
};
</script>

<style></style>
