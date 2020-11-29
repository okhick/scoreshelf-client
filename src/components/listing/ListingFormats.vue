<template>
  <!-- <div>{{ formats }}</div> -->
  <div>
    <div
      v-for="format in formats"
      :key="format.formatId"
      :class="['formats', { selected: format.formatId === selectedFormat }]"
      @click="selectedFormat = format.formatId"
    >
      <div class="format">{{ format.format }}</div>
      <div class="price">${{ format.price }}</div>
    </div>
  </div>
</template>

<script>
import useListing from '@/compositions/listing/listing.js';
import { ref } from '@vue/composition-api';

export default {
  setup() {
    const { listingData, selectedFormat } = useListing();
    const formats = listingData.value.attributes.publicData.formats;

    return {
      formats,
      selectedFormat,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.formats {
  display: inline-block;
  color: $black;
  height: 70px;
  width: 166px;
  border: 1px solid $black-transp;
  border-radius: 4px;
  padding: 13px;
  line-height: 1.1;
  margin-right: 11px;
  cursor: pointer;
}
.price {
  font-size: 20px;
  font-weight: 500;
}
.format {
  font-size: 16px;
  font-weight: 400;
}
.selected {
  border: 2px solid $maroon;
  background-color: $maroon-transp;
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.17);
}
</style>