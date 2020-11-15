<template>
  <div class="columns">
    <div :class="['column', previewSize[selectPreviewSize]]">{{ selectPreviewSize }}</div>
    <div class="column is-half">Second column</div>
    <div class="column is-one-quarter">Third column</div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from '@vue/composition-api';
import useListing from '@/compositions/listing/listing.js';

export default {
  setup(_, context) {
    const listingId = context.root.$route.params.id;
    const { getSearchListing } = useListing(listingId);

    // ========== Get the needed data ==========
    onMounted(() => {
      getSearchListing();
    });

    // ========== Control the size of the preview ==========
    const previewSize = ref({
      isSmall: 'is-one-quarter',
      isLarge: 'is-half',
    });
    const selectPreviewSize = ref('isSmall');
    return { previewSize, selectPreviewSize };
  },
};
</script>

<style>
</style>