<template>
  <div>
    <div v-show="messages.success.profile" class="notification is-success is-light">
      <button class="delete" @click="closeMessage('success','profile')"></button>
      Your profile has been updated!
    </div>
    <h1 class="title">Edit your profile</h1>

    <label class="label">First Name</label>
    <div class="field has-addons">
      <div class="control">
        <input
          :disabled="firstName.disabled"
          class="input"
          type="text"
          v-model="firstName.value"
        />
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
        <input
          :disabled="lastName.disabled"
          class="input"
          type="text"
          v-model="lastName.value"
        />
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
        <input
          :disabled="email.disabled"
          class="input"
          type="text"
          v-model="email.value"
        />
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
import { mapState } from "vuex";
import { sharetribe } from "@/mixins/sharetribe.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUnlock, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faUnlock, faLock);

export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      firstName: {
        disabled: true,
        value: ""
      },
      lastName: {
        disabled: true,
        value: ""
      },
      displayName: {
        disabled: true,
        value: ""
      },
      email: {
        disabled: true,
        value: ""
      },
      isLoading: false,
      messages: {
        success: {
          profile: false
        }
      }
    };
  },
  mixins: [sharetribe],
  methods: {
    toggleEnable: function(element) {
      this[element].disabled = !this[element].disabled;
    },
    closeMessage(passFail, message) {
      this.messages[passFail][message] = !this.messages[passFail][message];
    },
    updateProfile: async function() {
      this.isLoading = true;
      let res = await this.SHARETRIBE.currentUser.updateProfile({
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        displayName: this.displayName.value
      });
      this.refreshLogin();
      console.log(res.data);
      this.messages.success.profile = true;
      this.isLoading = false;
    }
  },
  async mounted() {
    await this.refreshLogin();
    this.firstName.value = this.currentUser.attributes.profile.firstName;
    this.lastName.value = this.currentUser.attributes.profile.lastName;
    this.displayName.value = this.currentUser.attributes.profile.displayName;
    this.email.value = this.currentUser.attributes.email;
  },
  computed: {
    ...mapState(["currentUser"])
  }
};
</script>
