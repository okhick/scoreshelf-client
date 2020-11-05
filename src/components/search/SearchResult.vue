<template>
  <div class="work-card">
    <div
      class="info-wrapper"
      :class="{ 'hide-info': hideInfo, 'more-info': hideThumb }"
      @mouseover="hideThumb = true"
      @mouseleave="hideThumb = false"
    >
      <div class="secondary-info hidden-info">
        <p>42:00</p>
        <p>Commissioned by some Utah Ensemble</p>
      </div>
      <div class="info-spacer"></div>
      <div class="info">
        <div class="human secondary-info">{{ listing.attributes.publicData.composer }} (1990)</div>
        <div class="result-titles">
          <div class="result-title">{{ listing.attributes.title }}</div>
          <div class="result-subtitle">
            {{ listing.attributes.publicData.subtitle }}
          </div>
        </div>
        <div class="ensemble secondary-info">
          {{ showEnsembleOrInstrumentation }}
        </div>
      </div>
    </div>
    <div class="thumb">
      <img
        :src="`${publicPath}brickwall.png`"
        :class="{ 'hide-thumb': hideThumb }"
        alt=""
        @mouseover="hideInfo = true"
        @mouseleave="hideInfo = false"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';

export default {
  props: { listing: Object },
  setup({ listing }) {
    const hideInfo = ref(false);
    const hideThumb = ref(false);
    const publicPath = process.env.BASE_URL;

    const showEnsembleOrInstrumentation = computed(() => {
      return listing.attributes.publicData.ensemble
        ? listing.attributes.publicData.ensemble
        : listing.attributes.publicData.instrumentation;
    });

    return {
      hideInfo,
      hideThumb,
      publicPath,
      showEnsembleOrInstrumentation,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
.work-card {
  width: 360px;
  height: 380px;
  background-color: $tan;
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  z-index: 1;
  position: relative;
  box-shadow: 0px 0px 17px 0px rgba(0, 0, 0, 0.17);
}

/* Stuff for the info */
.info-wrapper {
  padding: 10px 20px 10px 20px;
  // font-family: 'Fira Sans';
  font-weight: 200;
  font-size: 16px;
  color: $off-white;
  background-color: $maroon;
  border-radius: 4px 4px 21px 21px;
  transition: all 0.25s ease-in-out;
  height: 260px;
  top: -80px;
  position: relative;
  display: grid;
  grid-template-rows: [hidden-data] auto [gap] 1fr [main-data] auto;
}

/* the top hidden stuff */
.hide-info {
  transform: translateY(-200px);
}
.more-info {
  transform: translateY(80px);
}
.hidden-info {
  grid-row: hidden-data;
  align-self: start;
}
.info-spacer {
  grid-row: gap;
}

/* the main info */
.info {
  grid-row: main-data;
  align-self: end;
  /* start the main info grid */
  display: grid;
  grid-template-rows: [human] auto [titles] 1fr [ensemble] auto;
  height: 160px;
}
.secondary-info {
  // font-family: 'Ubuntu';
  font-weight: 400;
}
.human {
  grid-row: human;
  align-self: start;
}
.result-titles {
  grid-row: titles;
  align-self: center;
}
.result-title {
  // font-family: 'Lato', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1em;
}
.result-subtitle {
  padding-top: 4px;
  font-weight: 500;
}
.ensemble {
  grid-row: ensemble;
  align-self: end;
}

/* Stuff for the thumbnail */
.thumb {
  position: absolute;
  top: 238px;
  padding: 20px 20px 0 20px;
  z-index: 3;
}
.thumb img {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.25s ease-in-out;
}
.thumb img:hover {
  transform: scale(0.78) translateY(-362px);
}
.hide-thumb {
  transform: translateY(80px);
}
</style>
