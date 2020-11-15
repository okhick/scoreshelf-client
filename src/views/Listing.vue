<template>
  <div class="columns">
    <div :class="['column', previewSize[previewSize.select]]">{{ previewSize.select }}</div>
    <div class="column is-half">
      <mainInfo v-bind:listing="listingData"></mainInfo>
    </div>
    <div class="column is-one-quarter"></div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs } from '@vue/composition-api';
import useListing from '@/compositions/listing/listing.js';

import mainInfo from '@/components/listing/main.vue';

export default {
  components: {
    mainInfo,
  },
  setup(_, context) {
    const listingId = context.root.$route.params.id;
    const { getSearchListing } = useListing(listingId);

    const listingData = ref(null);

    // ========== Get the needed data ==========
    onMounted(async () => {
      listingData.value = await getSearchListing();
    });

    // ========== Control the size of the preview ==========
    const previewSize = ref({
      select: 'isSmall',
      isSmall: 'is-one-quarter',
      isLarge: 'is-half',
    });

    return { previewSize, listingData };
  },
};
</script>

<style>
</style>