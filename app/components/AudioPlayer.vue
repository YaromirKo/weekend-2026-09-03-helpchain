<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
  guideId: string;
}>();

const languages = [
  { label: 'English', code: 'en' },
  { label: 'Spanish', code: 'es' },
  { label: 'French', code: 'fr' },
] as const;

const selectedLanguageCode = ref<(typeof languages)[number]['code']>('en');
const audioElement = ref<HTMLAudioElement | null>(null);
const audioUrl = ref('');
const audioLanguageCode = ref('');
const audioStatus = ref<'idle' | 'loading' | 'ready' | 'playing' | 'error'>('idle');
const audioError = ref('');
const currentTime = ref(0);
const duration = ref(0);

const selectedLanguage = computed(() => (
  languages.find((language) => language.code === selectedLanguageCode.value) || languages[0]
));
const isLoadingAudio = computed(() => audioStatus.value === 'loading');
const isPlaying = computed(() => audioStatus.value === 'playing');
const progressPercent = computed(() => {
  if (!duration.value) {
    return 0;
  }

  return Math.min(100, Math.round((currentTime.value / duration.value) * 100));
});
const timeLabel = computed(() => `${formatTime(currentTime.value)} / ${duration.value ? formatTime(duration.value) : '0:00'}`);

const togglePlayback = async () => {
  if (isLoadingAudio.value) {
    return;
  }

  if (isPlaying.value) {
    audioElement.value?.pause();
    return;
  }

  await loadAudio();
  if (audioStatus.value === 'error' || !audioUrl.value) {
    return;
  }

  await nextTick();

  try {
    await audioElement.value?.play();
  } catch (error) {
    console.error('Guide audio playback failed', error);
    audioStatus.value = 'error';
    audioError.value = 'Audio playback could not start.';
  }
};

const loadAudio = async () => {
  if (audioUrl.value && audioLanguageCode.value === selectedLanguageCode.value) {
    audioStatus.value = 'ready';
    return;
  }

  revokeAudioUrl();
  audioStatus.value = 'loading';
  audioError.value = '';

  try {
    const audio = await $fetch<Blob>(`/api/help/guides/${encodeURIComponent(props.guideId)}/audio`, {
      method: 'POST',
      body: {
        language: selectedLanguageCode.value,
      },
      responseType: 'blob',
    });

    audioUrl.value = URL.createObjectURL(audio);
    audioLanguageCode.value = selectedLanguageCode.value;
    audioStatus.value = 'ready';
  } catch (error) {
    console.error('Guide audio failed to load', error);
    audioStatus.value = 'error';
    audioError.value = 'Audio could not be generated right now.';
  }
};

const handleTimeUpdate = () => {
  currentTime.value = audioElement.value?.currentTime || 0;
};

const handleLoadedMetadata = () => {
  duration.value = audioElement.value?.duration || 0;
};

const handlePlay = () => {
  audioStatus.value = 'playing';
};

const handlePause = () => {
  if (audioStatus.value === 'playing') {
    audioStatus.value = 'ready';
  }
};

const handleEnded = () => {
  audioStatus.value = 'ready';
  currentTime.value = 0;
};

const revokeAudioUrl = () => {
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }

  audioUrl.value = '';
  audioLanguageCode.value = '';
  currentTime.value = 0;
  duration.value = 0;
};

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

watch(selectedLanguageCode, () => {
  audioElement.value?.pause();
  revokeAudioUrl();
  audioStatus.value = 'idle';
  audioError.value = '';
});

onBeforeUnmount(() => {
  revokeAudioUrl();
});
</script>

<template>
  <section class="rounded-[4px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft sm:p-7">
    <div class="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
      <div>
        <StatusBadge tone="amber">Making the guide listenable: ElevenLabs</StatusBadge>
        <h2 class="mt-4 text-3xl font-semibold leading-tight text-hc-ink">
          Listen instead
        </h2>
        <p class="mt-3 max-w-md text-base leading-7 text-hc-muted">
          The same help in a format that's easier to follow.
        </p>
      </div>

      <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4 sm:p-5">
        <fieldset>
          <legend class="sr-only">Audio language</legend>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="language in languages"
              :key="language.code"
              class="min-h-10 rounded-[4px] border px-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald"
              :class="selectedLanguageCode === language.code ? 'border-hc-emerald bg-hc-emerald text-white' : 'border-hc-line bg-hc-paper text-hc-muted hover:text-hc-ink'"
              type="button"
              :aria-pressed="selectedLanguageCode === language.code"
              :disabled="isLoadingAudio"
              @click="selectedLanguageCode = language.code"
            >
              {{ language.label }}
            </button>
          </div>
        </fieldset>

        <div class="mt-5 flex items-center gap-4 rounded-[4px] border border-hc-line bg-hc-paper px-4 py-4">
          <button
            class="flex size-11 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-white transition duration-200 hover:bg-[#0b4333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald"
            type="button"
            :aria-label="isPlaying ? 'Pause narration' : `Play ${selectedLanguage.label} narration`"
            :aria-busy="isLoadingAudio"
            :disabled="isLoadingAudio"
            @click="togglePlayback"
          >
            <svg v-if="!isPlaying" class="ml-0.5 size-5" viewBox="0 0 32 32" aria-hidden="true">
              <path d="m12 8 13 8-13 8V8Z" fill="currentColor" />
            </svg>
            <svg v-else class="size-5" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M10 8h4v16h-4V8Zm8 0h4v16h-4V8Z" fill="currentColor" />
            </svg>
          </button>

          <div class="min-w-0 flex-1">
            <div class="h-2 overflow-hidden rounded-full bg-hc-emerald-soft" aria-hidden="true">
              <div class="h-full rounded-full bg-hc-emerald transition-all duration-200" :style="{ width: `${progressPercent}%` }" />
            </div>
            <p class="mt-2 text-sm font-semibold leading-5 text-hc-muted">
              {{ isLoadingAudio ? 'Generating audio...' : timeLabel }}
            </p>
            <p v-if="audioError" class="mt-1 text-sm font-semibold leading-5 text-hc-coral" role="alert">
              {{ audioError }}
            </p>
          </div>
        </div>

        <audio
          ref="audioElement"
          class="sr-only"
          :src="audioUrl"
          @timeupdate="handleTimeUpdate"
          @loadedmetadata="handleLoadedMetadata"
          @play="handlePlay"
          @pause="handlePause"
          @ended="handleEnded"
        />
      </div>
    </div>
  </section>
</template>
