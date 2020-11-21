<template>
  <div class="preview-wrapper" @click="$emit('toggle-preview-size')">
    <span :class="['toggle-size', toggleSettings.iconJustify]">
      <progress
        class="progress"
        v-show="loadAmount !== 100"
        :value="loadAmount ? loadAmount : 0"
        max="100"
      />
      <font-awesome-icon v-show="loadAmount === 100" :icon="toggleSettings.icon" size="lg" />
    </span>
    <p class="toggle-size-text">{{ toggleSettings.text }}</p>
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="loadingTask"
      :page="i"
      :class="['pdf-page', toggleSettings.pdfClass]"
      @page-loaded="pageLoaded = $event"
    />
  </div>
</template>

<script>
import { onMounted, ref, computed, watch } from '@vue/composition-api';
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

    // ========== Data for PDF renderer ==========
    const loadingTask = ref();
    const numPages = ref();

    // ========== Data for the loading bar ==========
    const pageLoaded = ref();
    const loadAmount = computed(() => Math.floor((pageLoaded.value / numPages.value) * 100));

    // ========== Toggle needed DOM elements based on size selection
    const toggleSettings = computed(() => {
      switch (props.currentSize) {
        case 'isSmall':
          return {
            icon: 'angle-double-right',
            iconJustify: 'right',
            text: 'CLICK TO EXPAND',
            pdfClass: 'small',
          };
          break;
        case 'isLarge':
          return {
            icon: 'angle-double-left',
            iconJustify: 'left',
            text: 'CLICK TO COLLAPSE',
            pdfClass: 'large',
          };
          break;
      }
    });

    // ========== Load and reload PDF Preview ==========
    onMounted(async () => {
      if (listingData.value.attributes.publicData?.preview?.asset_id) {
        loadPreview();
      }
    });
    async function loadPreview() {
      await getPreviewBuffer();
      loadingTask.value = pdf.createLoadingTask(previewBuffer.value);
      const loadPdf = await loadingTask.value.promise;
      numPages.value = loadPdf.numPages;
    }

    watch(toggleSettings, () => reloadPreview());
    async function reloadPreview() {
      loadingTask.value = pdf.createLoadingTask(previewBuffer.value);
      const loadPdf = await loadingTask.value.promise;
      numPages.value = loadPdf.numPages;
    }

    return {
      // ---- data ----
      toggleSettings,
      // ---- for pdf render ----
      loadingTask,
      numPages,
      // ---- loading bar ----
      pageLoaded,
      loadAmount,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index';
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
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
.toggle-size {
  padding: 6px 8px 6px 8px;
  position: sticky;
  top: 0;
  background-color: rgba(149, 51, 50, 0.4);
  z-index: 2;
  display: flex;
}
.toggle-size svg {
  color: #fafafa;
}
.right {
  justify-content: right;
}
.left {
  justify-content: left;
}
.toggle-size-text {
  text-align: center;
  color: #fafafa;
  font-size: 13px;
  padding: 0px 8px 6px 8px;
}

.preview-wrapper .progress {
  margin: 4px;
  background-color: $off-white;
}

.pdf-page {
}

.small {
  padding: 0 10% 5% 10%;
}
.large {
  padding: 0 5% 2.5% 5%;
}
</style>