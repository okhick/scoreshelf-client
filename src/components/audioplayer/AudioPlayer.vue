<template>
  <div class="audio-wrapper">
    <font-awesome-icon class="play" :icon="['far', 'play-circle']" size="2x" />
    <div class="audio-progress">
      <vue-slider v-model="progress" :lazy="true"></vue-slider>
    </div>

    <div class="audio-time">2:34</div>
  </div>
</template>

<script>
import { onMounted, ref } from '@vue/composition-api';

import VueSlider from 'vue-slider-component';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlayCircle);

export default {
  components: {
    FontAwesomeIcon,
    VueSlider,
  },
  setup() {
    const progress = ref(0);

    return {
      progress,
    };
  },
};
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
  margin: 0 12px 8px;
  display: flex;
  align-items: center;

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