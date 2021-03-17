<template>
  <section>
    <div class="field control">
      <label class="label">Instrumentation</label>
      <autocomplete
        :search="search"
        placeholder="Search for instruments"
        aria-label="Search for instruments"
        @update="setSelectedIndex"
        @submit="saveSelectedInstrument"
      >
        <template
          #default="{
            rootProps,
            inputProps,
            inputListeners,
            resultListProps,
            resultListListeners,
            results,
            resultProps,
          }"
        >
          <div v-bind="rootProps">
            <div class="control has-icons-right">
              <input
                :class="[
                  'input',
                  { 'rounded-top': results.length > 0 },
                  { 'is-invalid': ensembleInstValidation.status === false },
                ]"
                type="text"
                placeholder="Search for an instrument"
                v-model="inputValue"
                v-bind="inputProps"
                v-on="inputListeners"
              />
              <span class="icon is-small is-right">
                <!-- <font-awesome-icon icon="check" v-show="isValid === true" /> -->
                <font-awesome-icon icon="ban" v-show="ensembleInstValidation.status === false" />
              </span>
            </div>
            <ul v-bind="resultListProps" v-on="resultListListeners" class="results">
              <li
                v-for="(result, index) in results"
                :key="resultProps[index].id"
                v-bind="resultProps[index]"
                :class="{ 'is-highlighted': selectedIndex === index }"
              >
                {{ result }}
              </li>
            </ul>
          </div>
        </template>
      </autocomplete>
    </div>

    <div class="field is-grouped is-grouped-multiline">
      <div class="control" v-for="(instrument, index) in formData.instrumentation" :key="index">
        <div class="tags has-addons">
          <div class="tag is-tan">{{ instrument }}</div>
          <div class="tag is-delete" @click="removeInstrument(index)"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { onMounted, ref, computed, SetupContext } from '@vue/composition-api';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import startcase from 'lodash.startcase';
import fullList from '@/store/listReduced.json';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faBan);

import useSharetribePublisher from '@/compositions/sharetribe/sharetribePublisher';
import useValidationState from '@/compositions/validation/validationState';

import { Data } from '@/@types';

export default {
  components: {
    Autocomplete,
    FontAwesomeIcon,
  },
  setup(_: Data, context: SetupContext) {
    // ========== Load up instrument list ==========
    const flatList = ref<string[]>([]);

    onMounted(() => {
      const instrumentList = fullList.map((instrument) => instrument.Instrument);
      flatList.value = instrumentList.flat();
    });

    // ========== Handle instrument search ==========
    function search(term: string): string[] {
      let matches: string[] = flatList.value.filter((instrument: string) => {
        const match = instrument.toLowerCase().search(term.toLowerCase());
        return match > -1;
      });
      matches = matches.map((match) => startcase(match));
      matches = matches.sort();
      return matches;
    }

    // ========== Handle instrument selection and display ==========
    const inputValue = ref<string>();
    const { formData } = useSharetribePublisher();

    function saveSelectedInstrument(result: string | undefined): void {
      if (formData.value.instrumentation == undefined) {
        formData.value.instrumentation = [];
      }

      // if there was a dropdown selection, use that. If not, use the input assuming it's not blank
      if (result != undefined) {
        formData.value.instrumentation.push(result);
      } else if (inputValue.value != undefined && inputValue.value != '') {
        formData.value.instrumentation.push(inputValue.value);
      }

      inputValue.value = undefined;
    }
    function removeInstrument(index: number): void {
      formData.value.instrumentation.splice(index, 1);
    }

    // ========== Handle highlight on arrow keys. ==========
    const selectedIndex = ref(-1);
    function setSelectedIndex(results: any[], selectedIndexInput: number): void {
      selectedIndex.value = selectedIndexInput;
    }

    //========== Validation ==========//
    const { ValidationStore } = useValidationState();
    const ensembleInstValidation = computed(() => ValidationStore.publishFormInfo.ensembleInst);

    return {
      // ---- Data ----
      selectedIndex,
      formData /* this loses reactivity when you do formdata.value.instrumentation */,
      inputValue,
      // ---- Methods ----
      search,
      setSelectedIndex,
      saveSelectedInstrument,
      removeInstrument,
      ensembleInstValidation,
    };
  },
};
</script>

<style lang="scss">
@import '@/styles/index.scss';

label.label {
  display: inline-block;
  margin-right: 4px;
}
.validation {
  display: inline;
}

.control {
  .rounded-top:focus {
    border-radius: 4px 4px 0 0;
  }
  ul.results {
    box-shadow: 0px 0.5px 8px 0px rgba(0, 0, 0, 0.4);
    background-color: $off-white;
    outline: $black;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow: scroll;

    li {
      padding: 6px;
      cursor: pointer;
    }

    .is-highlighted {
      background-color: $tan;
    }

    li:hover {
      background-color: $tan;
    }

    li:last-child {
      border-radius: 0 0 4px 4px;
    }
  }

  .tag.is-tan {
    background-color: $tan-light;
  }

  .tag.is-delete {
    background-color: $maroon;

    &:after,
    &:before {
      color: $off-white;
    }

    &:hover {
      cursor: pointer;
      background-color: $tan-light;
    }
    &:hover:after,
    &:hover:before {
      color: $maroon;
    }
  }
}
</style>
