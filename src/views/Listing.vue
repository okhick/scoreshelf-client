<template>
  <div class="columns">
    <div :class="['column', previewSize[previewSize.select]]">
      <listing-preview v-if="gotListingData" />
    </div>
    <div class="column is-half">
      <listing-main v-if="gotListingData" />
    </div>
    <div class="column is-one-quarter"></div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs, watch } from '@vue/composition-api';
import useListing from '@/compositions/listing/listing.js';

import ListingMain from '@/components/listing/ListingMain.vue';
import ListingPreview from '@/components/listing/ListingPreview';

export default {
  components: {
    ListingMain,
    ListingPreview,
  },
  setup(_, context) {
    const listingId = context.root.$route.params.id;
    const { getSearchListing, listingData } = useListing(listingId);

    // ========== Get the needed data ==========
    const gotListingData = ref(false);
    onMounted(async () => {
      await getSearchListing();
      gotListingData.value = true;
    });

    // ========== Control the size of the preview ==========
    const previewSize = ref({
      select: 'isSmall',
      isSmall: 'is-one-quarter',
      isLarge: 'is-half',
    });

    return {
      previewSize,
      gotListingData,
    };
  },
};
</script>

<style>
</style>