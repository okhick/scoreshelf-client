<template>
  <div class="field control">
    <label class="label">Instrumentation</label>
    <autocomplete
      :search="search"
      placeholder="Search for instruments"
      aria-label="Search for instruments"
      @update="setSelectedIndex"
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
</template>

<script lang="ts">
import Vue from 'vue';
import Autocomplete from '@trevoreyre/autocomplete-vue';
import startcase from 'lodash.startcase';
import fullList from '@/store/listReduced.json';

interface Instrumentation {
  flatList: string[];
  fullList: any;
  selectedIndex: number;
}

interface Instrument {
  Instrument: String;
  Classification: String;
  'H-S Number': String;
  Origin: String;
  'Common classification': String;
  Relation: String;
}

export default Vue.extend({
  components: {
    Autocomplete,
  },
  data(): Instrumentation {
    return {
      fullList,
      flatList: [],
      selectedIndex: -1,
    };
  },
  methods: {
    flattenInstrumentList: function (): string[] {
      const instrumentList = this.fullList.map((instrument: Instrument) => instrument.Instrument);
      return instrumentList.flat();
    },
    search: function (term: string) {
      let matches: string[] = this.flatList.filter((instrument: string) => {
        const match = instrument.toLowerCase().search(term.toLowerCase());
        return match > -1;
      });
      matches = matches.map((match) => startcase(match));
      matches = matches.sort();
      return matches;
    },
    setSelectedIndex: function (results: any[], selectedIndex: number): void {
      this.selectedIndex = selectedIndex;
    },
  },
  mounted() {
    this.flatList = this.flattenInstrumentList();
  },
});
</script>

<style lang="scss">
@import '@/styles/index.scss';

// hardcode bulma style here because I don't have access to classes with autofil/ component
.control {
  ul.results {
    box-shadow: 0px 0.5px 8px 0px rgba(0, 0, 0, 0.4);
    background-color: $off-white;
    outline: $black;
    border-radius: 0 0 4px 4px;
    max-height: 200px;
    overflow: scroll;

    li {
      padding: 8px;
      cursor: pointer;
    }

    li:hover {
      background-color: $tan;
    }

    li:last-child {
      border-radius: 0 0 4px 4px;
    }
  }
}
.rounded-top:focus {
  border-radius: 4px 4px 0 0;
}
.is-highlighted {
  background-color: $tan;
}
</style>