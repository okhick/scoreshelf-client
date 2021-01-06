<template>
  <table class="table is-fullwidth is-narrow">
    <thead>
      <th>Filename</th>
      <th>Date Added</th>
      <th>Size</th>
      <th></th>
    </thead>
    <tr v-for="file in fileList" :key="file.asset_name">
      <td v-if="file.link" valign="middle">
        <a :href="file.link">{{ file.asset_name }}</a>
      </td>
      <td v-else valign="middle">{{ file.asset_name }}</td>

      <td valign="middle">{{ formatDate(file.date_added) }}</td>

      <td valign="middle">{{ calculateSize(file) }}</td>

      <td align="right" class="hover-pointer">
        <font-awesome-icon icon="times" @click="$emit('remove-file', file.asset_name)" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api';
import { GenericAsset } from '@/@types';
import { DateTime } from 'luxon';

import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faTimes);

export default defineComponent({
  props: {
    fileList: {
      required: true,
      type: Array as PropType<GenericAsset[]>,
    },
  },
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { useScoreshelfHelpers } = useScoreshelfPublisher();

    function formatDate(dateString: string) {
      return dateString ? DateTime.fromISO(dateString).toFormat('DDD') : '';
    }

    return {
      formatDate,
      calculateSize: useScoreshelfHelpers.calculateSize,
    };
  },
});
</script>

<style lang="scss" scoped>
.hover-pointer:hover {
  cursor: pointer;
}
</style>
