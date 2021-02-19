<template>
  <div class="work-card">
    <div
      class="info-wrapper"
      :class="{ 'hide-info': hideInfo, 'more-info': moreInfo }"
      @mouseover="hideThumbnail"
      @mouseleave="peekThumbnail"
      @click="goToListing"
    >
      <div class="secondary-info hidden-info">
        <p>{{ listing.attributes.publicData.duration }}</p>
        <p>{{ listing.attributes.publicData.commission }}</p>
      </div>
      <div class="info-spacer"></div>
      <div class="info" @click="goToListing">
        <div class="human secondary-info">{{ composers }}</div>
        <div class="result-titles">
          <div class="result-title">
            {{ listing.attributes.title }} <span class="result-year">{{ showYear }}</span>
          </div>
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
        @click="goToListing"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, PropType, defineComponent } from '@vue/composition-api';
import useScoreshelf from '@/compositions/scoreshelf/scoreshelf';
import useSearch from '@/compositions/search/search';
import debounce from 'lodash.debounce';

import { Listing, ListingThumbnailHydrated, isListingThumbnailHydrated } from '@/@types';

// using defineComponent is key to getting the props working here
export default defineComponent({
  props: {
    listing: {
      required: true,
      type: Object as PropType<Listing>,
    },
  },
  setup({ listing }, context) {
    const showEnsembleOrInstrumentation = computed(() => {
      return listing.attributes.publicData.ensemble
        ? listing.attributes.publicData.ensemble
        : listing.attributes.publicData.instrumentation;
    });

    const showYear = computed(() => {
      return listing.attributes.publicData.year ? `(${listing.attributes.publicData.year})` : '';
    });

    const { stringifyComposers } = useSearch(context);
    const composers = computed(() => {
      if (listing.attributes.publicData.composer) {
        return stringifyComposers(listing);
      } else {
        return '';
      }
    });

    // ========== Get thumbnail link ==========
    const pathToThumbnail = computed(() => {
      const { THUMBNAIL_BASE_URL } = useScoreshelf();
      const thumbnail = listing.attributes.publicData.thumbnail;

      if (thumbnail && isListingThumbnailHydrated(thumbnail)) {
        return `${THUMBNAIL_BASE_URL}/${thumbnail.sharetribe_user_id}/${thumbnail.sharetribe_listing_id}/${thumbnail.asset_name}`;
      } else {
        // TODO: this should just be a default thumbnail
        return `${process.env.BASE_URL}brickwall.png`;
      }
    });

    // ========== Scale and transform thumbnail ==========
    const transformThumbnailAction = ref('peek');
    const transformThumbnail = ref({
      show: '',
      peek: 'transform: scale(1) translateY(0px);',
      hide: 'transform: translateY(80px);',
    });

    interface SizedEvent {
      target: {
        width: number;
        height: number;
      };
    }
    function calculateTransfrorm(event: SizedEvent & Event) {
      // These constants are also set in the CSS below
      const CARD_HEIGHT = 380; // .work-card
      const TOP_BUFFER = 20; //   .thumb
      const PEEK_HEIGHT = 142; // CARD_HEIGHT - .thumb:top

      const PEEK_POS = CARD_HEIGHT - PEEK_HEIGHT; // 238
      const NEEDED_PORTRAIT_IMG_HEIGHT = CARD_HEIGHT - TOP_BUFFER * 2; //340

      const height = event.target.height;
      const width = event.target.width;

      if (height >= width) {
        /* 
        1. Scale the image to fit the height of card
        2. Calculate the top position of the showing thumbnail
        3. Find the distance between current and ending, invert because we're going up 
        */
        const scale = NEEDED_PORTRAIT_IMG_HEIGHT / event.target.height;
        const showPos = (CARD_HEIGHT - NEEDED_PORTRAIT_IMG_HEIGHT) / 2;
        const translate = (PEEK_POS - showPos + TOP_BUFFER) * -1;
        transformThumbnail.value.show = `transform: translateY(${translate}px) scale(${scale});`;
      } else {
        const showPos = (CARD_HEIGHT - height) / 2;
        const translate = (PEEK_POS - showPos + TOP_BUFFER) * -1;
        transformThumbnail.value.show = `transform: translateY(${translate}px);`;
      }
    }

    // ========== Handle hover events ==========
    const hideInfo = ref(false);
    const moreInfo = ref(false);
    function showThumbnail() {
      debounce(() => {
        hideInfo.value = true;
        moreInfo.value = false;
        transformThumbnailAction.value = 'show';
      }, 25)();
    }
    function peekThumbnail() {
      debounce(() => {
        hideInfo.value = false;
        moreInfo.value = false;
        transformThumbnailAction.value = 'peek';
      }, 50)();
    }
    function hideThumbnail() {
      hideInfo.value = false;
      moreInfo.value = true;
      transformThumbnailAction.value = 'hide';
    }

    function goToListing() {
      context.root.$router.push({
        name: 'Listing',
        params: { id: encodeURIComponent(listing.id.uuid) },
      });
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
      composers,
      // ---- Methods ----
      showThumbnail,
      showYear,
      peekThumbnail,
      hideThumbnail,
      calculateTransfrorm,
      goToListing,
    };
  },
});
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
  height: 260px;
  top: -80px;
  position: relative;
  display: grid;
  grid-template-rows: [hidden-data] auto [gap] 1fr [main-data] auto;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
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
.result-year {
  font-weight: 300;
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
  cursor: pointer;
}
</style>
