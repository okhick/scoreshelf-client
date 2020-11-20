<template>
  <div class="preview-wrapper" @click="$emit('toggle-preview-size')">
    <span class="toggle-size">
      <font-awesome-icon
        :icon="toggleSettings.icon"
        :class="{ right: currentSize === 'isSmall', left: currentSize === 'isLarge' }"
        size="lg"
      />
    </span>
    <p class="toggle-size-text">{{ toggleSettings.text }}</p>
    <pdf v-for="i in numPages" :key="i" :src="loadingTask" :page="i" class="pdf-page" />
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
    const progress = ref();

    onMounted(async () => {
      if (listingData.value.attributes.publicData?.preview?.asset_id) {
        await getPreviewBuffer();
        loadingTask.value = pdf.createLoadingTask(previewBuffer.value);
        const loadPdf = await loadingTask.value.promise;
        numPages.value = loadPdf.numPages;
      }
    });

    const toggleSettings = computed(() => {
      switch (props.currentSize) {
        case 'isSmall':
          return {
            icon: 'angle-double-right',
            text: 'CLICK TO EXPAND',
          };
          break;
        case 'isLarge':
          return {
            icon: 'angle-double-left',
            text: 'CLICK TO COLLAPSE',
          };
          break;
      }
    });

    return {
      toggleSettings,
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
  padding: 6px 8px 6px 8px;
  position: sticky;
  top: 0;
  background-color: rgba(149, 51, 50, 0.4);
  z-index: 2;
}
.toggle-size svg {
  transition: all 0.25s ease-in-out;
  color: #fafafa;
}
.toggle-size-text {
  text-align: center;
  color: #fafafa;
  font-size: 13px;
  padding: 0px 8px 6px 8px;
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