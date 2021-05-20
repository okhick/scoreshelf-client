<template>
  <div>
    <h1 class="title">{{ formData.title }}</h1>
    <h2 v-if="formData.subtitle != ''" class="subtitle">{{ formData.subtitle }}</h2>
    <div id="roles">
      <p v-for="(role, index) in formData.role" :key="index">{{ getRoleName(role) }}</p>
    </div>
    <div id="formats">
      <table class="table">
        <tr v-for="format in formats" :key="format.formatId">
          <td id="format">{{ format.format }}</td>
          <td>{{ `$${format.price}` }}</td>
          <td>
            <p
              v-for="(asset, index) in format.assets"
              :key="index"
              v-html="getAssetLink(asset)"
            ></p>
          </td>
        </tr>
      </table>
    </div>
    <table class="info-table">
      <tr v-if="formData.ensemble != ''">
        <td>Ensemble:</td>
        <td>{{ formData.ensemble }}</td>
      </tr>
      <tr v-if="formData.instrumentation && formData.instrumentation.length > 0">
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
    <div v-if="formData.tags && formData.tags.length > 0" id="tags">
      <p>{{ `#${formData.tags.join(', #')}` }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useSharetribe from '@/compositions/sharetribe/sharetribe';
import useScoreshelfPublisher from '@/compositions/scoreshelf/scoreshelfPublisher';
import { Asset, ListingRole, UploadedFile } from '@/@types';

export default {
  setup() {
    const { formData, DISPLAY_NAME } = useSharetribePublisher();
    const { useSharetribeState } = useSharetribe();
    const { formats, fileList } = useScoreshelfPublisher();

    function getRoleName(role: ListingRole): string {
      if (role.name === DISPLAY_NAME.value) {
        role.name = useSharetribeState.currentUser.value?.attributes.profile.displayName || '';
      }
      return `${role.name} — ${role.role}`;
    }

    function isAsset(asset: Asset | UploadedFile): asset is Asset {
      return asset.isStored;
    }
    function getAssetLink(assetName: string) {
      const fullAsset = fileList.value.find((fullAsset) => assetName === fullAsset.asset_name);
      if (fullAsset && isAsset(fullAsset)) {
        return `<a href="${fullAsset.link}" target="_blank">${assetName}</a>`;
      }
      return assetName;
    }

    return {
      formData,
      formats,
      getRoleName,
      getAssetLink,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.table {
  width: 100%;

  td#format {
    white-space: nowrap;
    text-align: right;
  }
}

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