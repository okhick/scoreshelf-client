<template>
  <div>{{ formats }}</div>
</template>

<script>
import useListing from '@/compositions/listing/listing.js';
// import { watch, ref } from '@vue/composition-api';

export default {
  setup() {
    const { listingData } = useListing();
    const formats = listingData.value.attributes.publicData.formats;

    return {
      formats,
    };
  },
};
</script>

<style>
</style>