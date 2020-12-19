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
            <input
              :class="['input', { 'rounded-top': results.length > 0 }]"
              v-bind="inputProps"
              v-on="inputListeners"
              v-model="inputValue"
            />
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
      <div class="control" v-for="(instrument, index) in selectedInstruments" :key="index">
        <div class="tags has-addons">
          <div class="tag is-tan">{{ instrument }}</div>
          <div class="tag is-delete" @click="removeInstrument(index)"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, ref } from '@vue/composition-api';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import startcase from 'lodash.startcase';
import fullList from '@/store/listReduced.json';

export default Vue.extend({
  components: {
    Autocomplete,
  },
  setup(_, context) {
    const flatList = ref<string[]>([]);

    onMounted(() => {
      const instrumentList = fullList.map((instrument) => instrument.Instrument);
      flatList.value = instrumentList.flat();
    });

    function search(term: string): string[] {
      let matches: string[] = flatList.value.filter((instrument: string) => {
        const match = instrument.toLowerCase().search(term.toLowerCase());
        return match > -1;
      });
      matches = matches.map((match) => startcase(match));
      matches = matches.sort();
      return matches;
    }

    // save a selected instrument
    const selectedInstruments = ref<string[]>([]);
    const inputValue = ref<string>();
    function saveSelectedInstrument(result: string): void {
      selectedInstruments.value.push(result);
      inputValue.value = undefined;
    }
    function removeInstrument(index: number): void {
      selectedInstruments.value.splice(index, 1);
    }

    // Handle highlight on arrow keys.
    const selectedIndex = ref(-1);
    function setSelectedIndex(results: any[], selectedIndexInput: number): void {
      selectedIndex.value = selectedIndexInput;
    }

    return {
      // ---- Data ----
      selectedIndex,
      selectedInstruments,
      inputValue,
      // ---- Methods ----
      search,
      setSelectedIndex,
      saveSelectedInstrument,
      removeInstrument,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/index.scss';

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