<template>
  <div class="fixed size">
    <font-awesome-icon class="play" :icon="['far', 'play-circle']" size="4x" />
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faPlayCircle);

export default {
  components: {
    FontAwesomeIcon,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.fixed {
  position: fixed;
  bottom: 12px;
  right: 12px;
}
.size {
  height: 80px;
  width: 80px;
  background-color: $maroon;
  border-radius: 4px;
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.4);
  transition: width 0.25s ease-in-out;
}
.size:hover {
  width: 400px;
}
.play {
  color: $off-white;
  margin: 8px 8px;
}
</style>