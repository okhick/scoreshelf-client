<template>
  <div
    :class="[
      'audio-wrapper',
      { 'margin-player-is-small': currentSize === 'isSmall' },
      { 'margin-player-is-large': currentSize === 'isLarge' },
    ]"
    @click.stop
  >
    <font-awesome-icon class="play" :icon="['far', playIcon]" size="2x" @click="togglePlaying" />
    <div class="audio-progress">
      <vue-slider
        v-model="audioProgress"
        :lazy="true"
        tooltip="hover"
        tooltip-placement="bottom"
        @drag-start="beginScrubAudio"
        @drag-end="scrubAudio"
      ></vue-slider>
    </div>

    <div class="audio-time">2:34</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api';
import { useListingAudio } from '@/compositions/listing/listingAudio';

import VueSlider from 'vue-slider-component';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlayCircle, faPauseCircle);

export default defineComponent({
  components: {
    FontAwesomeIcon,
    VueSlider,
  },
  props: {
    currentSize: {
      required: true,
      type: String as PropType<string>,
    },
  },
  setup() {
    const {
      // ----- state
      isPlaying,
      audioProgress,
      // ----- methods
      togglePlaying,
      beginScrubAudio,
      scrubAudio,
    } = useListingAudio();

    const playIcon = computed(() => (isPlaying.value ? 'pause-circle' : 'play-circle'));

    return {
      beginScrubAudio,
      isPlaying,
      audioProgress,
      playIcon,
      togglePlaying,
      scrubAudio,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/index.scss';

$themeColor: $off-white;
$bgColor: $off-white;
$dotShadow: none;
$tooltipColor: $black;

@import '~vue-slider-component/lib/theme/default.scss';

// override the inline padding.
// for some reason, the padding takes up all space making the rail invisible
.audio-wrapper .vue-slider {
  padding: 0 4px !important;
}
</style>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.audio-wrapper {
  position: sticky;
  display: flex;
  align-items: center;
  top: 0;
  // margin: 8px 8px;
  padding: 8px 6px;
  background-color: $maroon;
  z-index: 2;

  &.margin-player-is-small {
    margin-right: 26px;
  }
  &.margin-player-is-large {
    margin-left: 26px;
  }

  .audio-progress {
    flex-grow: 1;
    margin: auto 8px;
    // height: 24px;
  }

  .audio-time {
    // align-self: flex-end;
    color: $off-white;
  }

  .play {
    color: $off-white;
  }
}
</style>