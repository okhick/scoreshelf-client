<template>
  <div class="preview-wrapper">
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="loadingTask"
      :page="i"
      style="padding: 8px 38px 8px 38px"
    ></pdf>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';
import pdf from 'vue-pdf';
import useListing from '@/compositions/listing/listing.js';

export default {
  components: {
    pdf,
  },
  setup() {
    const { getPreviewBuffer, previewBuffer } = useListing();
    const loadingTask = ref();
    const numPages = ref();

    onMounted(async () => {
      await getPreviewBuffer();
      loadingTask.value = pdf.createLoadingTask(previewBuffer.value);
      const loadPdf = await loadingTask.value.promise;
      numPages.value = loadPdf.numPages;
    });

    return {
      loadingTask,
      numPages,
    };
  },
};
</script>

<style scoped>
.preview-wrapper {
  background-color: #953332;
  overflow-y: scroll;
  display: flex;
  flex-flow: column;
  /* screen height - search bar height - bulma padding on columns */
  height: calc(100vh - 64px - 12px);
}
.pdf-page {
  margin: 5px 10px 5px 10px;
}
</style>