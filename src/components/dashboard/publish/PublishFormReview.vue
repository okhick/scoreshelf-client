<template>
  <div>
    <h1 class="title">{{ formData.title }}</h1>
    <h2 v-if="formData.subtitle != ''" class="subtitle">{{ formData.subtitle }}</h2>
    <div id="roles">
      {{ formData.role }}
    </div>
    <div id="formats">{{ formats }}</div>
    <table class="info-table">
      <tr v-if="formData.ensemble != ''">
        <td>Ensemble:</td>
        <td>{{ formData.ensemble }}</td>
      </tr>
      <tr v-if="formData.instrumentation.length > 0">
        <td>Instrumentation:</td>
        <td>
          {{ formData.instrumentation.join(', ') }}
        </td>
      </tr>
      <tr v-if="formData.year != ''">
        <td>Year of Completion:</td>
        <td>{{ formData.year }}</td>
      </tr>
      <tr v-if="formData.duration != ''">
        <td>Duration:</td>
        <td>{{ formData.duration }}</td>
      </tr>
      <tr v-if="formData.commission != ''">
        <td>Commission or Dedication:</td>
        <td>{{ formData.commission }}</td>
      </tr>
    </table>
    <div id="otherNotes">
      <p v-html="formData.otherNotes"></p>
    </div>
    <div id="tags">
      <p>{{ `#${formData.tags.join(', #')}` }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

export default {
  setup() {
    const { formData } = useSharetribePublisher();
    const { formats, fileList } = useScoreshelfPublisher();

    return {
      formData,
      formats,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.info-table {
  margin: 25px 0;
  color: $black;
  font-size: 16px;

  td:first-child {
    font-weight: bold;
    text-align: right;
  }

  th,
  td {
    padding: 0 3px;
  }
}

.no-data {
  font-size: 14px;
  vertical-align: bottom;
}

#formats,
#otherNotes,
#tags {
  margin-top: 25px;
  margin-bottom: 25px;
}
</style>