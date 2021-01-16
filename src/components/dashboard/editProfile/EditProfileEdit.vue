<template>
  <div class="column is-two-thirds">
    <div class="columns">
      <div class="column is-half">
        <label class="label">First Name</label>
        <div class="field">
          <div class="control">
            <input class="input" type="text" v-model="userProfile.firstName" />
          </div>
        </div>
      </div>
      <div class="column is-half">
        <label class="label">Last Name</label>
        <div class="field">
          <div class="control">
            <input class="input" type="text" v-model="userProfile.lastName" />
          </div>
        </div>
      </div>
    </div>
    <label class="label">Display Name or Pseudonym</label>
    <div class="field">
      <div class="control">
        <input class="input" type="text" v-model="userProfile.displayName" />
      </div>
    </div>
    <label class="label">Bio</label>
    <div class="field">
      <div class="control">
        <trix-editor-component
          v-bind:init-content="userProfile.bio"
          @trix-editor-change="handleNewContent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TrixEditorComponent from '@/components/forms/TrixEditor.vue';
import DashboardState from '@/compositions/dashboard/dashboardState';

export default {
  components: {
    TrixEditorComponent,
  },
  setup() {
    const { userProfile } = DashboardState();

    // ========== handle Trix ==========
    function handleNewContent(event: string) {
      userProfile.value.bio = event;
    }

    return {
      userProfile,
      handleNewContent,
    };
  },
};
</script>
