<template>
  <div>
    <h2 class="title is-2 publication-title">{{ listing.attributes.title }}</h2>
    <h3 v-if="listing.attributes.publicData.subtitle" class="title is-3 publication-subtitle">
      {{ listing.attributes.publicData.subtitle }}
    </h3>
    <h4 class="title is-4 publication-composer">{{ listing.attributes.publicData.composer }}</h4>

    <listing-formats />

    <div class="add-to-cart" @click="addToCart"><p>Add to cart</p></div>

    <div class="info-table">
      <table>
        <tr v-if="listing.attributes.publicData.instrumentation">
          <td>Instrumentation:</td>
          <td>{{ listing.attributes.publicData.instrumentation }}</td>
        </tr>
        <tr v-if="listing.attributes.publicData.ensemble">
          <td>Ensemble:</td>
          <td>{{ listing.attributes.publicData.ensemble }}</td>
        </tr>
        <tr v-if="listing.attributes.publicData.duration">
          <td>Duration:</td>
          <td>{{ listing.attributes.publicData.duration }}</td>
        </tr>
        <tr v-if="listing.attributes.publicData.year">
          <td>Year:</td>
          <td>{{ listing.attributes.publicData.year }}</td>
        </tr>
        <tr v-if="listing.attributes.publicData.commission">
          <td>Commission:</td>
          <td>{{ listing.attributes.publicData.commission }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import useListing from '@/compositions/listing/listing.js';
import { watch, ref } from '@vue/composition-api';

import ListingFormats from '@/components/listing/ListingFormats.vue';

export default {
  components: {
    ListingFormats,
  },
  setup() {
    const { listingData, selectedFormat } = useListing();

    function addToCart() {
      console.log(selectedFormat);
    }

    return {
      listing: listingData,
      addToCart,
    };
  },
};
</script>

<style scoped>
h2.title.is-2.publication-title {
  margin-top: 40px;
  margin-bottom: 5px;
  font-weight: bold;
}

h3.title.is-3,
h4.title.is-4 {
  font-weight: medium;
}

h4.title.is-4.publication-composer {
  margin-top: 40px;
  margin-bottom: 40px;
}

.add-to-cart {
  height: 38px;
  width: 166px;
  background-color: #953332;
  color: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 11px;
  cursor: pointer;
}

.info-table {
  margin: 27px 0 27px 0;
  color: #282828;
}

.info-table td:first-child {
  font-weight: bold;
  text-align: right;
}
.info-table th,
.info-table td {
  padding: 0 3px 0 3px;
}
</style>

