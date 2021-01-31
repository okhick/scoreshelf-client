<template>
  <div>
    <label class="label">Publisher Name</label>
    <div class="field">
      <div class="control">
        <input class="input" type="text" v-model="userProfile.publisher.name" />
      </div>
    </div>
    <label class="label">Publisher About</label>
    <div class="field">
      <div class="control">
        <trix-editor-component
          v-bind:init-content="userProfile.publisher.about"
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
      userProfile.value.publisher.about = event;
    }

    return {
      userProfile,
      handleNewContent,
    };
  },
};
</script>