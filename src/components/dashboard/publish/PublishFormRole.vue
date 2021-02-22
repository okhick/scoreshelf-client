<template>
  <div id="role-wrapper">
    <label class="label">Roles</label>
    <div class="field is-horizontal">
      <div class="field-body">
        <!-- Role -->
        <div class="field" id="role-choose" v-show="!otherFlag">
          <div class="control">
            <div class="select">
              <select v-model="inputRole.role">
                <option value="" disabled selected hidden>Choose role...</option>
                <option v-for="(role, index) in predefinedRoles" :key="index">
                  {{ role }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="field" id="role-other" v-show="otherFlag">
          <div class="control">
            <input
              class="input"
              type="format"
              placeholder="Co-composer"
              @keyup.delete="switchBackToDropdown"
              v-model="inputRole.role"
            />
          </div>
        </div>
        <!-- Name -->
        <div class="field has-addons" id="role-name">
          <div class="control is-expanded">
            <input
              class="input"
              type="text"
              v-model.trim="inputRole.name"
              @keyup.enter="saveRole"
              placeholder="Person name"
            />
          </div>
          <div class="control">
            <button @click="saveCurrentUserAsRole" class="button is-tan">
              {{ displayName }}
            </button>
          </div>
          <div class="control">
            <button @click="saveRole" class="button is-tan">
              <font-awesome-icon icon="plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Human Labels -->
    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="(role, index) in formData.role" :key="index">
        <div class="tags has-addons">
          <div class="tag is-tan">
            {{ `${role.name === DISPLAY_NAME ? displayName : role.name} &mdash; ${role.role}` }}
          </div>
          <div class="tag is-delete" @click="removeRole(index)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed, watchEffect } from '@vue/composition-api';

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useDashboard from '@/compositions/dashboard/dashboard';
import useSharetribe from '@/compositions/sharetribe/sharetribe';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlus);

import { ListingRole } from '@/@types';

export default {
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const { useSharetribeState } = useSharetribe();
    const { currentUser } = useSharetribeState;

    const { formData, DISPLAY_NAME } = useSharetribePublisher();
    const { useDashboardState } = useDashboard();
    const { publishModalEditData } = useDashboardState;

    onMounted(() => {
      if (publishModalEditData.value?.attributes) {
        const editRoleData = publishModalEditData?.value.attributes.publicData.role;
        formData.value.role = editRoleData != undefined ? editRoleData : [];
      }
    });

    const inputRole = ref<ListingRole>(initRole());

    // Handle the role functions
    const predefinedRoles = ['Composer', 'Arranger', 'Editor', 'Lyricist', 'Librettist', 'Other'];
    const otherFlag = ref(false);
    watchEffect(() => {
      if (!otherFlag.value) {
        if (inputRole.value.role === 'Other') {
          otherFlag.value = true;
          inputRole.value.role = '';
        }
      }
    });
    function switchBackToDropdown() {
      if (inputRole.value.role === '') {
        otherFlag.value = false;
      }
    }

    //==========

    const displayName = computed(() => {
      return currentUser.value?.attributes.profile.displayName || '';
    });

    function saveRole() {
      if (inputRole.value.name != '' && inputRole.value.role != '') {
        formData.value.role.push({
          name: inputRole.value.name,
          role: inputRole.value.role,
        });
      }
      inputRole.value = initRole();
    }

    function removeRole(index: number) {
      formData.value.role.splice(index, 1);
    }

    function saveCurrentUserAsRole() {
      if (inputRole.value.role != '') {
        const newRole = {
          name: DISPLAY_NAME.value,
          role: inputRole.value.role,
        };
        formData.value.role.push(newRole);
        inputRole.value = initRole();
      }
    }

    function initRole(): ListingRole {
      return { name: '', role: '' };
    }

    return {
      formData,
      predefinedRoles,
      otherFlag,
      saveRole,
      switchBackToDropdown,
      removeRole,
      displayName,
      saveCurrentUserAsRole,
      DISPLAY_NAME,
      inputRole,
    };
  },
};
</script>

<style lang="scss" scoped>
#role-wrapper {
  margin-bottom: 12px;
}

#role-choose,
#role-other {
  flex-grow: 0.09;
}
#role-choose {
  margin-right: 1px;
}
#role-other {
  margin-right: 4px;
}
</style>
