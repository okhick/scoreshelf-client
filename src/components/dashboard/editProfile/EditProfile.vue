<template>
  <div>
    <div v-show="messages.success.profile" class="notification is-success is-light">
      <button class="delete" @click="closeMessage('success', 'profile')"></button>
      Your profile has been updated!
    </div>

    <div class="columns">
      <div class="column is-half">
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

    <button
      class="button is-dark"
      :class="{ 'is-loading': isLoading }"
      type="button"
      @click="updateProfile"
    >
      <strong>Update</strong>
    </button>

    <hr class="hr" />

    <label class="label">Email</label>
    <div class="field has-addons">
      <div class="control">
        <input :disabled="email.disabled" class="input" type="text" v-model="email.value" />
      </div>
      <div class="control">
        <a class="button is-primary">
          <font-awesome-icon icon="lock" v-show="email.disabled" />
          <!-- TODO: Email change is a different process -->
          <font-awesome-icon icon="unlock" v-show="!email.disabled" />
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

interface IMessages {
  [key: string]: {
    [key: string]: boolean;
  };
}

export default {
  components: {
    FontAwesomeIcon,
    TrixEditorComponent,
  },
  setup() {
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
    const isLoading = ref(false);
    const dataHasLoaded = ref(false);
    const messages: IMessages = reactive({
      success: {
        profile: false,
      },
    });

    onMounted(async () => {
      await useRefreshLogin();
      await useUpdateCurrentUser();

      formData.firstName.value = currentUser.value?.attributes.profile.firstName || '';
      formData.lastName.value = currentUser.value?.attributes.profile.lastName || '';
      formData.displayName.value = currentUser.value?.attributes.profile.displayName || '';
      formData.bio.value = currentUser.value?.attributes.profile.bio || '';
      formData.email.value = currentUser.value?.attributes.email || '';

      dataHasLoaded.value = true;
    });

    // methods
    const { useRefreshLogin, useSharetribeState, useUpdateCurrentUser } = useSharetribe();
    const { SHARETRIBE, currentUser } = useSharetribeState;

    function handleNewContent(event: string) {
      formData.bio.value = event;
    }

    function closeMessage(passFail: string, message: string) {
      messages[passFail][message] = !messages[passFail][message];
    }

    async function updateProfile() {
      isLoading.value = true;
      const res = await SHARETRIBE.value.currentUser.updateProfile({
        firstName: formData.firstName.value,
        lastName: formData.lastName.value,
        displayName: formData.displayName.value,
        bio: formData.bio.value,
      });
      await useRefreshLogin();
      messages.success.profile = true;
      isLoading.value = false;
    }

    return {
      ...toRefs(formData),
      messages,
      isLoading,
      handleNewContent,
      closeMessage,
      currentUser,
      updateProfile,
      dataHasLoaded,
    };
  },
};
</script>
