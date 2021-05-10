<template>
  <div class="publication">
    <h2 class="title is-2 title">{{ listing.attributes.title }}</h2>
    <h3 v-if="listing.attributes.publicData.subtitle" class="title is-3 subtitle">
      {{ listing.attributes.publicData.subtitle }}
    </h3>
    <div class="roles">
      <div class="role" v-for="(role, index) in rolesString" :key="index" v-html="role"></div>
    </div>

    <listing-formats />

    <div class="add-to-cart" @click="addToCart"><p>Add to cart</p></div>

    <div class="info-table">
      <table>
        <tr v-if="listing.attributes.publicData.instrumentation">
          <td>Instrumentation:</td>
          <td>{{ stringifyInstruments(listing.attributes.publicData.instrumentation) }}</td>
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

    <div class="other-notes">
      <!-- <h5>Program Notes:</h5> -->
      <p v-html="listing.attributes.publicData.otherNotes"></p>
    </div>
  </div>
</template>

<script lang="ts">
import useListing from '@/compositions/listing/listing';
import { computed, SetupContext } from '@vue/composition-api';
import { Data } from '@/@types';

import ListingFormats from '@/components/listing/ListingFormats.vue';

export default {
  components: {
    ListingFormats,
  },
  setup(_: Data, context: SetupContext) {
    const { listingData, selectedFormat, stringifyRoles } = useListing(undefined, context);

    function addToCart() {
      console.log(selectedFormat.value, 'has been selected for cart');
    }

    function stringifyInstruments(instruments: string[]) {
      return instruments.join(', ');
    }

    const rolesString = computed(() => {
      if (listingData.value?.attributes.publicData.role) {
        return stringifyRoles();
      } else {
        return '';
      }
    });

    return {
      listing: listingData,
      addToCart,
      stringifyInstruments,
      rolesString,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.publication {
  display: flex;
  flex-direction: column;
  margin-top: 32px;
}
h2.title.is-2.title {
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 48px;
}

h3.title.is-3 {
  font-weight: 500;
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

.other-notes {
  color: $black;
}
.other-notes h5 {
  font-size: 20px;
  font-family: 'lato';
  font-weight: bold;
}
.other-notes p {
  font-size: 16px;
}
</style>

<style lang="scss">
// There's something at the global scope polluting this so it can't be scoped
@import '@/styles/index.scss';
.roles {
  margin-bottom: 24px;

  .role {
    h4.is-4.role-name {
      font-weight: 500;
      font-size: 20px;
      font-family: $family-secondary;
      display: inline;
    }
    span.role-role {
      font-size: 15px;
      font-family: $family-primary;
    }
  }
}
</style>
