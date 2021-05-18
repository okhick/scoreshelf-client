import { reactive, toRefs } from '@vue/composition-api';
import { Howl } from 'howler';

// ============================================

interface IListingAudioState {
  isPlaying: boolean;
  audioProgress: number | Howl;
  restartAfterScrub: boolean;
}
const ListingAudioState = reactive<IListingAudioState>({
  isPlaying: false,
  audioProgress: 0,
  restartAfterScrub: false,
});

// ============================================

export function useListingAudio() {
  const audio = new Howl({
    src: ['https://nyc3.digitaloceanspaces.com/scoreshelf/Give_me%20Jesus.mp3'],
    html5: true,
  });

  // ===== Handle starting and stopping =====

  function pauseAudio() {
    audio.pause();
    ListingAudioState.isPlaying = false;
  }
  function playAudio() {
    audio.play();
    ListingAudioState.isPlaying = true;
    getProgress();
  }
  function togglePlaying() {
    if (ListingAudioState.isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  // ===== Handle progress and scrubbing =====
  function getProgress() {
    if (ListingAudioState.isPlaying) {
      ListingAudioState.audioProgress = audio.seek();
      setTimeout(() => getProgress(), 250);
    }
  }
  function beginScrubAudio() {
    ListingAudioState.restartAfterScrub = ListingAudioState.isPlaying;
    pauseAudio();
  }
  function scrubAudio() {
    audio.seek(<number>ListingAudioState.audioProgress);
    if (ListingAudioState.restartAfterScrub) {
      playAudio();
      // reset this
      ListingAudioState.restartAfterScrub = false;
    }
  }

  return {
    ...toRefs(ListingAudioState),
    // -----
    togglePlaying,
    // -----
    beginScrubAudio,
    scrubAudio,
  };
}
