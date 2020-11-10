<template>
  <div>
    <div v-show="messages.success.profile" class="notification is-success is-light">
      <button class="delete" @click="closeMessage('success', 'profile')"></button>
      Your profile has been updated!
    </div>
    <h1 class="title">Edit your profile</h1>

    <label class="label">First Name</label>
    <div class="field has-addons">
      <div class="control">
        <input :disabled="firstName.disabled" class="input" type="text" v-model="firstName.value" />
      </div>
      <div class="control">
        <a class="button is-primary" @click="toggleEnable('firstName')">
          <font-awesome-icon icon="lock" v-show="firstName.disabled" />
          <font-awesome-icon icon="unlock" v-show="!firstName.disabled" />
        </a>
      </div>
    </div>

    <label class="label">Last Name</label>
    <div class="field has-addons">
      <div class="control">
        <input :disabled="lastName.disabled" class="input" type="text" v-model="lastName.value" />
      </div>
      <div class="control">
        <a class="button is-primary" @click="toggleEnable('lastName')">
          <font-awesome-icon icon="lock" v-show="lastName.disabled" />
          <font-awesome-icon icon="unlock" v-show="!lastName.disabled" />
        </a>
      </div>
    </div>

    <label class="label">Display Name</label>
    <div class="field has-addons">
      <div class="control">
        <input
          :disabled="displayName.disabled"
          class="input"
          type="text"
          v-model="displayName.value"
        />
      </div>
      <div class="control">
        <a class="button is-primary" @click="toggleEnable('displayName')">
          <font-awesome-icon icon="lock" v-show="displayName.disabled" />
          <font-awesome-icon icon="unlock" v-show="!displayName.disabled" />
        </a>
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

<script>
import { mapState } from 'vuex';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { createNamespacedHelpers } from 'vuex-composition-helpers/dist';
const sharetribeStore = createNamespacedHelpers('sharetribe'); // specific module name

import { library } from '@fortawesome/fontawesome-svg-core';
import { faUnlock, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, reactive, ref, toRefs } from '@vue/composition-api';
library.add(faUnlock, faLock);

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    // Data
    const { currentUser, SHARETRIBE } = sharetribeStore.useState(['currentUser', 'SHARETRIBE']);
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
      email: {
        disabled: true,
        value: '',
      },
    });
    const isLoading = ref(false);
    const messages = reactive({
      success: {
        profile: false,
      },
    });

    onMounted(async () => {
      await useRefreshLogin();
      formData.firstName.value = currentUser.value.attributes.profile.firstName;
      formData.lastName.value = currentUser.value.attributes.profile.lastName;
      formData.displayName.value = currentUser.value.attributes.profile.displayName;
      formData.email.value = currentUser.value.attributes.email;
    });

    // methods
    const { useRefreshLogin } = useSharetribe();

    function toggleEnable(element) {
      formData[element].disabled = !formData[element].disabled;
    }
    function closeMessage(passFail, message) {
      messages[passFail][message] = !messages[passFail][message];
    }
    async function updateProfile() {
      isLoading.value = true;
      const res = await SHARETRIBE.value.currentUser.updateProfile({
        firstName: formData.firstName.value,
        lastName: formData.lastName.value,
        displayName: formData.displayName.value,
      });
      await useRefreshLogin();
      messages.success.profile = true;
      isLoading.value = false;
    }

    return {
      ...toRefs(formData),
      messages,
      isLoading,
      currentUser,
      updateProfile,
      toggleEnable,
    };
  },
};
</script>
