<template>
  <div class="work-card">
    <transition name="fade">
      <div class="overlay" v-show="hideInfo"></div>
    </transition>
    <div class="info">
      <div class="human">{{ listing.attributes.publicData.composer }}</div>
      <div class="result-title">{{ listing.attributes.title }}</div>
      <div class="result-subtitle">{{ listing.attributes.publicData.subtitle }}</div>
      <div class="ensemble">{{ showEnsembleOrInstrumentation }}</div>
    </div>
    <div class="thumb">
      <img
        :src="`${publicPath}brickwall.png`"
        alt=""
        @mouseover="hideInfo = true"
        @mouseleave="hideInfo = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hideInfo: false,
      publicPath: process.env.BASE_URL
    };
  },
  props: { listing: Object },
  computed: {
    showEnsembleOrInstrumentation: function() {
      if(this.listing.attributes.publicData.ensemble != "") {
        return this.listing.attributes.publicData.ensemble
      } else {
        return this.listing.attributes.publicData.instrumentation
      }
    }
  }
};
</script>

<style lang="css" scoped>

.work-card {
  width: 360px;
  height: 380px;
  background-color: #fff;
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  z-index: 1;
  position: relative;
}

/* Stuff for the info */
.info {
  padding: 20px;
  font-family: "Fira Sans";
  font-weight: 200;
  font-size: 16px;
  color: black;
}

.result-title {
  font-family: "Fira Sans", sans-serif;
  font-weight: 500;
  font-size: 24px;
  padding-top: 20px;
  line-height: 1em;
}

.result-subtitle {
  padding-top: 4px;
  font-weight: 400;
}

.ensemble {
  font-family: "Ubuntu";
  font-weight: 300;
  padding-top: 20px;
}

.human {
  font-family: "Ubuntu";
  font-weight: 300;
}

/* Stuff for the overlay */
.overlay {
  position: absolute;
  z-index: 2;
  background-color: #fff;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
</style>