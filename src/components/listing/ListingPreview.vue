<template>
  <div class="preview-wrapper" :style="previewHeight">
    <!-- @click="$emit('toggle-preview-size')" -->
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
    <audio-player />
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

<script lang="ts">
import { onMounted, ref, computed, watch, defineComponent, PropType } from '@vue/composition-api';
import pdf from 'vue-pdf';
import useListing from '@/compositions/listing/listing';

import AudioPlayer from '@/components/audioplayer/AudioPlayer.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faAngleDoubleRight, faAngleDoubleLeft);

// using defineComponent is key to getting the props working here
export default defineComponent({
  components: {
    pdf,
    FontAwesomeIcon,
    AudioPlayer,
  },
  props: {
    currentSize: {
      required: true,
      type: String as PropType<string>,
    },
  },
  setup(props, context) {
    const { getPreviewBuffer, previewBuffer, listingData, scrollPos } = useListing('', context);

    // ========== Data for PDF renderer ==========
    const loadingTask = ref<any>();
    const numPages = ref<number>(0);

    // ========== Data for the loading bar ==========
    const pageLoaded = ref<number>(0);
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
      if (listingData?.value?.attributes.publicData?.preview?.asset_id) {
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

    // ======== Resize preview on vertical scroll ==========
    const previewHeight = ref<string>('');

    watch(scrollPos, (newPos) => {
      previewHeight.value = stretchyPreview(newPos);
    });
    function stretchyPreview(newPos: number) {
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      // screen height - search bar height - bulma padding on columns
      const startingHeight = vh - 108 - 12;
      const height = startingHeight + newPos;
      const heightStr = height < vh - 24 ? `height: ${height}px` : `height: ${vh - 24}px`;

      // searchbar height - needed 'padding' on top
      const topStop = 108 - 8 - newPos;
      const topStopStr = topStop < 12 ? 'top: 12px' : `top: ${topStop}px;`;

      return `${heightStr}; ${topStopStr};`;
    }

    return {
      // ---- data ----
      toggleSettings,
      previewHeight,
      // ---- for pdf render ----
      loadingTask,
      numPages,
      // ---- loading bar ----
      pageLoaded,
      loadAmount,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/styles/index';

.preview-wrapper {
  background-color: $maroon;
  width: 90%;
  margin-left: 14px;
  overflow-y: scroll;
  display: flex;
  flex-flow: column;
  cursor: pointer;
  position: relative;
  z-index: 2;
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  /* screen height - search bar height - bulma padding on columns */
  height: calc(100vh - 108px - 12px);
  position: sticky;
  top: calc(108px - 8px);
}
.toggle-size {
  padding: 6px 8px 6px 8px;
  position: sticky;
  top: 0;
  background-color: $maroon-transp;
  z-index: 2;
  display: flex;
}
.toggle-size svg {
  color: $off-white;
}
.right {
  justify-content: right;
}
.left {
  justify-content: left;
}
.toggle-size-text {
  text-align: center;
  color: $off-white;
  font-size: 13px;
  padding: 0px 8px 6px 8px;
}

.preview-wrapper .progress {
  margin: 4px;
  background-color: $off-white;
}

.small {
  padding: 0 10% 5% 10%;
}
.large {
  padding: 0 5% 2.5% 5%;
}
</style>
