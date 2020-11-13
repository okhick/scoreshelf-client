<template>
  <div class="work-card">
    <div
      class="info-wrapper"
      :class="{ 'hide-info': hideInfo, 'more-info': moreInfo }"
      @mouseover="hideThumbnail"
      @mouseleave="peekThumbnail"
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
        :src="pathToThumbnail"
        :style="transformThumbnail[transformThumbnailAction]"
        alt=""
        @mouseover="showThumbnail"
        @mouseleave="peekThumbnail"
        @load="calculateTransfrorm"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf.js';

export default {
  props: { listing: Object },
  setup({ listing }) {
    const hideInfo = ref(false);
    const moreInfo = ref(false);
    // const transformThumbnail = ref('transform: scale(1) translateY(0px);');
    const transformThumbnailAction = ref('peek');
    const transformThumbnail = ref({
      show: '',
      peek: 'transform: scale(1) translateY(0px);',
      hide: 'transform: translateY(80px);',
    });

    const { THUMBNAIL_BASE_URL } = useScoreshelf();

    const showEnsembleOrInstrumentation = computed(() => {
      return listing.attributes.publicData.ensemble
        ? listing.attributes.publicData.ensemble
        : listing.attributes.publicData.instrumentation;
    });

    const pathToThumbnail = computed(() => {
      if (listing.attributes.publicData.thumbnail) {
        const thumbnail = listing.attributes.publicData.thumbnail;
        return `${THUMBNAIL_BASE_URL}/${thumbnail.sharetribe_user_id}/${thumbnail.sharetribe_listing_id}/${thumbnail.asset_name}`;
      } else {
        // TODO: this should just be a default thumbnail
        return `${process.env.BASE_URL}brickwall.png`;
      }
    });

    function calculateTransfrorm(event) {
      const CARD_HEIGHT = 380;
      const PEEK_HEIGHT = 142;
      const NEEDED_IMG_HEIGHT = 332;

      const scale = NEEDED_IMG_HEIGHT / event.target.height;
      const translate = (CARD_HEIGHT - PEEK_HEIGHT - 4) * -1; // -234 I don't know why I need the -4

      transformThumbnail.value.show = `transform: translateY(${translate}px) scale(${scale});`;
    }

    function showThumbnail() {
      hideInfo.value = true;
      moreInfo.value = false;
      transformThumbnailAction.value = 'show';
    }
    function peekThumbnail() {
      hideInfo.value = false;
      moreInfo.value = false;
      transformThumbnailAction.value = 'peek';
    }
    function hideThumbnail() {
      hideInfo.value = false;
      moreInfo.value = true;
      transformThumbnailAction.value = 'hide';
    }

    return {
      // ---- Data ----
      hideInfo,
      moreInfo,
      transformThumbnailAction,
      transformThumbnail,
      // ---- Computed ----
      showEnsembleOrInstrumentation,
      pathToThumbnail,
      // ---- Methods ----
      showThumbnail,
      peekThumbnail,
      hideThumbnail,
      calculateTransfrorm,
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
  transform-origin: center top;
}
// .thumb img:hover {
//   transform: scale(0.78) translateY(-362px);
// }
// .hide-thumb {
//   transform: translateY(80px);
// }
</style>
