<template>
  <div>
    <div class="columns">
      <!-- View Mode -->
      <div v-show="!editMode" class="column is-two-thirds namecard">
        <p>
          <span class="name"> {{ firstName.value }} {{ lastName.value }} </span>
          <span class="display-name">({{ displayName.value }})</span>
        </p>
        <p class="bio" v-html="bio.value"></p>
      </div>

      <!-- Edit mode -->
      <div class="column is-two-thirds" v-show="editMode">
        <div class="columns">
          <div class="column is-half">
            <label class="label">First Name</label>
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="firstName.value" />
              </div>
            </div>
          </div>
          <div class="column is-half">
            <label class="label">Last Name</label>
            <div class="field">
              <div class="control">
                <input class="input" type="text" v-model="lastName.value" />
              </div>
            </div>
          </div>
        </div>
        <label class="label">Display Name or Pseudonym</label>
        <div class="field">
          <div class="control">
            <input class="input" type="text" v-model="displayName.value" />
          </div>
        </div>
        <label class="label">Bio</label>
        <div class="field">
          <div class="control">
            <trix-editor-component
              v-if="dataHasLoaded"
              v-bind:init-content="bio.value"
              @trix-editor-change="handleNewContent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <button class="button is-dark" @click="toggleEditMode" v-show="!editMode">
      <strong>Edit</strong>
    </button>

    <button
      class="button is-dark"
      :class="{ 'is-loading': isLoading }"
      v-show="editMode"
      @click="updateProfile"
    >
      <strong>Update</strong>
    </button>

    <hr class="hr" />

    <!-- TODO: Email change is a different process -->
    <label class="label">Email</label>
    <div class="field has-addons">
      <div class="control">
        <input disabled class="input" type="text" v-model="email.value" />
      </div>
      <div class="control">
        <a class="button is-primary">
          <font-awesome-icon icon="lock" v-show="email.disabled" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import TrixEditorComponent from '@/components/forms/TrixEditor.vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUnlock, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, reactive, ref, toRefs, watchEffect } from '@vue/composition-api';
library.add(faUnlock, faLock);

export default {
  components: {
    FontAwesomeIcon,
    TrixEditorComponent,
  },
  setup() {
    const { useRefreshLogin, useSharetribeState, useUpdateCurrentUser } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;

    // ========== Load and init data ==========
    const formData = reactive({
      firstName: {
        disabled: true,
        value: '',
      },
      lastName: {
        disabled: true,
        value: '',
      },
      displayName: {
        disabled: true,
        value: '',
      },
      bio: {
        disabled: true,
        value: '',
      },
      email: {
        disabled: true,
        value: '',
      },
    });
    const dataHasLoaded = ref(false);

    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();

      formData.firstName.value = currentUser.value?.attributes.profile.firstName || '';
      formData.lastName.value = currentUser.value?.attributes.profile.lastName || '';
      formData.displayName.value = currentUser.value?.attributes.profile.displayName || '';
      formData.bio.value = currentUser.value?.attributes.profile.bio || '';
      formData.email.value = currentUser.value?.attributes.email || '';

      // Trix has issues when renedred before there's data
      dataHasLoaded.value = true;
    });

    // ========== handle Trix ==========
    function handleNewContent(event: string) {
      formData.bio.value = event;
    }

    // ========== update data ==========
    const isLoading = ref(false);
    async function updateProfile() {
      isLoading.value = true;
      const res = await SHARETRIBE.value.currentUser.updateProfile({
        firstName: formData.firstName.value,
        lastName: formData.lastName.value,
        displayName: formData.displayName.value,
        bio: formData.bio.value,
      });
      await useRefreshLogin();
      await useUpdateCurrentUser();
      toggleEditMode();
      isLoading.value = false;
    }

    // ========== toggle between edit and view modes ==========
    const editMode = ref(false);
    function toggleEditMode() {
      editMode.value = !editMode.value;
    }

    // ==========

    return {
      ...toRefs(formData),
      editMode,
      isLoading,
      handleNewContent,
      currentUser,
      updateProfile,
      dataHasLoaded,
      toggleEditMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.namecard {
  span.name {
    font-size: 20px;
    font-weight: 600;
  }
  span.display-name {
    font-size: 16px;
  }
  p.bio {
    padding: 12px;
  }
}
</style>
