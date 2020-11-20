<template>
  <div class="preview-wrapper" @click="$emit('toggle-preview-size')">
    <span class="toggle-size">
      <!-- {{ toggleWords }} -->
      <font-awesome-icon
        :icon="toggleWords"
        :class="{ right: currentSize === 'isSmall', left: currentSize === 'isLarge' }"
        size="lg"
      />
    </span>
    <pdf v-for="i in numPages" :key="i" :src="loadingTask" :page="i" class="pdf-page"></pdf>
  </div>
</template>

<script>
import { onMounted, ref, computed } from '@vue/composition-api';
import pdf from 'vue-pdf';
import useListing from '@/compositions/listing/listing.js';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faAngleDoubleRight, faAngleDoubleLeft);

export default {
  components: {
    pdf,
    FontAwesomeIcon,
  },
  props: {
    currentSize: String,
  },
  setup(props) {
    const { getPreviewBuffer, previewBuffer, listingData } = useListing();
    const loadingTask = ref();
    const numPages = ref();

    onMounted(async () => {
      if (listingData.value.attributes.publicData?.preview?.asset_id) {
        await getPreviewBuffer();
        loadingTask.value = pdf.createLoadingTask(previewBuffer.value);
        const loadPdf = await loadingTask.value.promise;
        numPages.value = loadPdf.numPages;
      }
    });

    const toggleWords = computed(() => {
      switch (props.currentSize) {
        case 'isSmall':
          return 'angle-double-right';
          break;
        case 'isLarge':
          return 'angle-double-left';
          break;
      }
    });

    return {
      toggleWords,
      loadingTask,
      numPages,
    };
  },
};
</script>

<style scoped>
.preview-wrapper {
  background-color: #953332;
  width: 90%;
  margin-left: 14px;
  overflow-y: scroll;
  display: flex;
  flex-flow: column;
  /* screen height - search bar height - bulma padding on columns */
  height: calc(100vh - 64px - 12px);
  cursor: pointer;
  position: relative;
  z-index: 2;
}
.toggle-size {
  color: #fafafa;
  padding: 6px 8px 6px 8px;
  font-weight: bold;
  font-size: 16px;
  position: sticky;
  top: 0;
}
.toggle-size svg {
  transition: all 0.25s ease-in-out;
  color: #fafafa;
}
.right {
  position: relative;
  left: 94%;
}
.left {
  position: relative;
  left: 0;
}
.pdf-page {
  padding: 0 10% 5% 10%;
}
</style>