<template>
  <div class="new-format-container" v-if="validation">
    <div class="new-format-data">
      <div class="field new-format" v-show="!otherFlag">
        <div class="control">
          <div class="select">
            <select
              v-model="newFormat.format"
              :class="[
                { 'is-invalid': validation.formatSelect.status === false },
                { 'is-valid': validation.formatSelect.status === true },
              ]"
            >
              <option value="" disabled selected hidden>Choose format...</option>
              <option v-for="(format, index) in predefinedFormats" :key="index">
                {{ format }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div
        :class="[
          'field',
          'new-format',
          { 'is-invalid': validation.formatSelect.status === false },
          { 'is-valid': validation.formatSelect.status === true },
        ]"
        v-show="otherFlag"
      >
        <div class="control">
          <input
            class="input"
            type="format"
            placeholder="Max Patch"
            @keyup.delete="switchBackToDropdown"
            v-model="newFormat.format"
          />
        </div>
      </div>

      <div class="field new-file">
        <div class="control">
          <div class="select">
            <select
              @input="newAssetSelected"
              v-model="assetSelectionModel"
              :class="[
                { 'is-invalid': validation.assetList.status === false },
                { 'is-valid': validation.assetList.status === true },
              ]"
            >
              <option value="" disabled selected hidden>Choose uploaded file(s)...</option>
              <option v-for="(asset, index) in assetSelectionMenu" :key="index">
                {{ asset }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div class="field new-price">
        <div class="control has-icons-left">
          <input class="input" type="price" placeholder="4.33" v-model="newFormat.price" />
          <span class="icon is-left"> $ </span>
        </div>
      </div>
    </div>

    <div class="new-action" @click="submitFormat" v-if="!isExistingFormat">
      <font-awesome-icon v-show="validation.completeValid" icon="plus" />
      <font-awesome-icon v-show="!validation.completeValid" icon="ban" class="is-invalid" />
    </div>

    <table class="table is-fullwidth is-narrow">
      <tr v-for="file in assetSelectionTable" :key="file.asset_name">
        <td v-if="file.link" valign="middle">
          <a :href="file.link">{{ file.asset_name }}</a>
        </td>
        <td v-else valign="middle">{{ file.asset_name }}</td>
        <td align="right" class="action">
          <font-awesome-icon icon="times" @click="removeAsset(file.asset_name)" />
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  PropType,
  onMounted,
  watchEffect,
  watch,
} from '@vue/composition-api';
import { Asset, UploadedFile, ChooseEvent, ListingFormat } from '@/@types';

import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import usePublishFormFormatsValidation from '@/compositions/validation/publishFormFormatsValidation';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTimes, faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus, faTimes, faBan);

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    initFormat: {
      required: true,
      type: Object as PropType<ListingFormat>,
    },
  },
  setup({ initFormat }) {
    const { formats, fileList } = useScoreshelfPublisher();
    const { useSharetribePublisherHelpers } = useSharetribePublisher();

    // Mutating props in Vue is anti-pattern so we'll copy it into a new const
    const newFormat = ref<ListingFormat>(initFormat);

    // Handle the dropdown or other box
    const predefinedFormats = [
      'Score and Part(s)',
      'Full Score',
      'Performance Score',
      'Solo Part',
      'Parts Only',
      'Choir Score',
      'Other',
    ];
    const otherFlag = ref(false);
    onMounted(() => {
      if (predefinedFormats.includes(initFormat.format) || initFormat.format === '') {
        otherFlag.value = false;
      } else {
        otherFlag.value = true;
      }
    });
    watchEffect(() => {
      if (!otherFlag.value) {
        if (newFormat.value.format === 'Other') {
          otherFlag.value = true;
          newFormat.value.format = '';
        }
      }
    });

    // ========== Handle validation ==========
    const { validateFormat } = usePublishFormFormatsValidation();
    const validation = ref();
    onMounted(() => (validation.value = validateFormat(initFormat)));
    watch(initFormat, () => (validation.value = validateFormat(initFormat)));

    // ==========
    function switchBackToDropdown() {
      if (newFormat.value.format === '') {
        otherFlag.value = false;
      }
    }

    const isExistingFormat = computed(() => {
      const formatIds = formats.value.map((format) => format.formatId);
      return formatIds.includes(newFormat.value.formatId);
    });

    const assetSelectionModel = ref('');
    const assetSelectionMenu = computed(() => {
      const allAssets = fileList.value.map((asset) => asset.asset_name);
      const unusedAssets = allAssets.filter((asset) => !newFormat.value.assets.includes(asset));

      // yes this is a weird place to set this, but there's some weird stuff going on when I set this to '' before I filter all assets...
      assetSelectionModel.value = '';
      return unusedAssets;
    });

    const assetSelectionTable = computed(() => {
      const selectedFullAssets = newFormat.value.assets.map((asset) => {
        return fileList.value.find((file) => file.asset_name === asset);
      }) as (Asset | UploadedFile)[]; /* Type assertion because this will never be undefined */
      return selectedFullAssets;
    });

    function newAssetSelected(event: Event & ChooseEvent) {
      const selectedAsset = event.target.value;
      newFormat.value.assets.push(selectedAsset);
    }

    function removeAsset(assetToRemove: string) {
      newFormat.value.assets = newFormat.value.assets.filter((asset) => asset !== assetToRemove);
    }

    function submitFormat() {
      if (isExistingFormat.value) {
        const formatIndex = formats.value.findIndex(
          (format) => format.formatId === newFormat.value.formatId
        );
        formats.value[formatIndex] = newFormat.value;
      } else {
        formats.value.push(newFormat.value);
        newFormat.value = useSharetribePublisherHelpers.getBlankFormat();
      }
    }

    return {
      // ---- Data ----
      newFormat,
      isExistingFormat,
      predefinedFormats,
      assetSelectionModel,
      assetSelectionMenu,
      assetSelectionTable,
      otherFlag,
      validation,
      // ---- Actions ----
      newAssetSelected,
      removeAsset,
      submitFormat,
      switchBackToDropdown,
    };
  },
});
</script>

<style lang="scss" scoped>
.new-format-container {
  display: grid;
  grid-template-columns: 32.5% auto auto;
  grid-template-rows: auto auto;
  column-gap: 8px;

  .new-format-data {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: 2fr auto 1fr;
    column-gap: 4px;
    align-items: center;

    .new-format {
      grid-column: 1;
      margin: 0;
    }
    .new-file {
      grid-column: 2;
      margin: 0;

      .select {
        // I HATE this...
        width: 268px;
      }
      option {
        width: 268px;
      }
    }
    .new-price {
      grid-column: 3;
    }
  }
  table {
    grid-column: 2;

    .action {
      cursor: pointer;
    }
  }
  .new-action {
    grid-column: 3;
    grid-row: 1;
    align-self: center;
    justify-self: center;
    cursor: pointer;
    padding-right: 9px;
  }
}
</style>
