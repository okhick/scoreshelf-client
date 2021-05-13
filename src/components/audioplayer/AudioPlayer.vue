<template>
  <div
    :class="[
      'audio-wrapper',
      { 'margin-player-is-small': currentSize === 'isSmall' },
      { 'margin-player-is-large': currentSize === 'isLarge' },
    ]"
    @click.stop
  >
    <font-awesome-icon class="play" :icon="['far', 'play-circle']" size="2x" />
    <div class="audio-progress">
      <vue-slider v-model="progress" tooltip-placement="bottom" :lazy="true"></vue-slider>
    </div>

    <div class="audio-time">2:34</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, PropType } from '@vue/composition-api';

import VueSlider from 'vue-slider-component';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlayCircle);

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
    const progress = ref(0);

    function test() {
      console.log('play pause');
    }

    return {
      progress,
      test,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/index.scss';
$themeColor: $off-white;
$bgColor: $off-white;
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