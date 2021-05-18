import { onMounted, reactive, toRefs } from '@vue/composition-api';
import { Howl } from 'howler';

// ============================================

interface IListingAudioState {
  isPlaying: boolean;
  audioProgress: {
    percent: number;
    seconds: number;
  };
  audioDuration: number;
  restartAfterScrub: boolean;
}
const ListingAudioState = reactive<IListingAudioState>({
  isPlaying: false,
  // the slider progress is 0-100 and Howl is 0-n seconds. Keep track of both.
  audioProgress: {
    percent: 0,
    seconds: 0,
  },
  audioDuration: 0,
  restartAfterScrub: false,
});

// ============================================

export function useListingAudio() {
  const audio = new Howl({
    src: ['https://nyc3.digitaloceanspaces.com/scoreshelf/Give_me%20Jesus.mp3'],
    html5: true,
    preload: 'metadata',
  });

  audio.on('load', () => (ListingAudioState.audioDuration = audio.duration()));

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
      ListingAudioState.audioProgress.seconds = <number>audio.seek();
      ListingAudioState.audioProgress.percent =
        (ListingAudioState.audioProgress.seconds / ListingAudioState.audioDuration) * 100;

      setTimeout(() => getProgress(), 250);
    }
  }
  function beginScrubAudio() {
    ListingAudioState.restartAfterScrub = ListingAudioState.isPlaying;
    pauseAudio();
  }
  function scrubAudio() {
    // the ListingAudioState.audioProgress.percent is modeled to the slider so it's up to date
    ListingAudioState.audioProgress.seconds =
      (ListingAudioState.audioProgress.percent / 100) * ListingAudioState.audioDuration;

    audio.seek(<number>ListingAudioState.audioProgress.seconds);
    if (ListingAudioState.restartAfterScrub) {
      playAudio();
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
