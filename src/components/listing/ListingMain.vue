<template>
  <div class="publication">
    <h2 class="title is-2 title">{{ listing.attributes.title }}</h2>
    <h3 v-if="listing.attributes.publicData.subtitle" class="title is-3 subtitle">
      {{ listing.attributes.publicData.subtitle }}
    </h3>
    <h4 class="title is-4 composer">{{ listing.attributes.publicData.composer }}</h4>

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

    <div class="program-notes">
      <h5>Program Notes:</h5>
      <p>{{ listing.attributes.publicData.programNotes }}</p>
    </div>
  </div>
</template>

<script>
import useListing from '@/compositions/listing/listing.js';
import { watch, ref, computed } from '@vue/composition-api';

import ListingFormats from '@/components/listing/ListingFormats.vue';

export default {
  components: {
    ListingFormats,
  },
  setup() {
    const { listingData, selectedFormat, scrollPos } = useListing();

    function addToCart() {
      console.log(selectedFormat.value, 'has been selected for cart');
    }

    return {
      listing: listingData,
      addToCart,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.publication {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* screen height - search bar height - bulma padding on columns */
  /* min-height: calc(100vh - 64px - 12px); */
  margin-top: 32px;
}
h2.title.is-2.title {
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 48px;
}

h3.subtitle {
  color: $black;
  font-size: 36px;
  margin: 0;
}

h3.title.is-3,
h4.title.is-4 {
  font-weight: 500;
}

h4.title.is-4.composer {
  margin-top: 40px;
  margin-bottom: 40px;
  font-size: 28px;
}

.add-to-cart {
  height: 38px;
  width: 166px;
  background-color: $black;
  color: $off-white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  margin-top: 11px;
  cursor: pointer;
  font-size: 20px;
}
.add-to-cart:hover {
  // background-color: rgba(40, 40, 40, 0.1);
  background-color: $tan-light;
  border: solid 1px $black;
  color: $black;
}

.info-table {
  margin: 27px 0 27px 0;
  color: $black;
  font-size: 16px;
}

.info-table td:first-child {
  font-weight: bold;
  text-align: right;
}
.info-table th,
.info-table td {
  padding: 0 3px 0 3px;
}

.program-notes {
  color: $black;
}
.program-notes h5 {
  font-size: 20px;
  font-family: 'lato';
  font-weight: bold;
}
.program-notes p {
  font-size: 16px;
}
</style>

