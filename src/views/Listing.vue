<template>
  <div class="columns">
    <div :class="['column', previewSize[previewSize.select]]">
      <listing-preview
        class="listing-preview"
        v-if="gotListingData"
        v-on:toggle-preview-size="togglePreviewSize()"
        :current-size="previewSize.select"
      />
    </div>
    <div class="column is-half">
      <listing-main v-if="gotListingData" />
    </div>
    <div class="column is-one-quarter"></div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs, watch } from '@vue/composition-api';
import useListing from '@/compositions/listing/listing';

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

    function togglePreviewSize() {
      switch (previewSize.value.select) {
        case 'isSmall':
          previewSize.value.select = 'isLarge';
          break;
        case 'isLarge':
          previewSize.value.select = 'isSmall';
          break;
      }
    }

    return {
      previewSize,
      gotListingData,
      togglePreviewSize,
    };
  },
};
</script>

<style>
.column {
  /* This is ROUGH */
  /* transition: all 0.25s ease-in-out; */
}
</style>
