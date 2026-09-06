<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  mapHelpRequestToSummary,
  processingSteps,
  seededGuideId,
  type HelpGuide,
  type HelpRequest,
  type HelpRequestSummary,
} from '~/data/helpchain';

const route = useRoute();

const request = ref<HelpRequestSummary | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);
const selectedVideo = ref<File | null>(null);
const videoAccepted = ref(false);
const reuseStatus = ref<'idle' | 'transforming' | 'ready'>('idle');
const helperName = ref('John');
const requestLoadError = ref('');
const processError = ref('');
const processedGuideId = ref('');
const isRequestLoading = ref(false);

const routeId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  return String(id || '');
});

const isTransforming = computed(() => reuseStatus.value === 'transforming');
const isReusableReady = computed(() => reuseStatus.value === 'ready');
const showProcessingMoment = computed(() => reuseStatus.value !== 'idle');
const requesterName = computed(() => request.value?.askedBy || 'someone');
const helperDisplayName = computed(() => helperName.value.trim() || 'The helper');
const helperInitial = computed(() => helperDisplayName.value.charAt(0).toUpperCase() || 'H');
const selectedVideoName = computed(() => selectedVideo.value?.name || 'No video selected');
const guidePath = computed(() => `/guide/${processedGuideId.value || seededGuideId}`);
const canSubmitVideo = computed(() => (
  Boolean(request.value) &&
  Boolean(selectedVideo.value) &&
  Boolean(helperName.value.trim()) &&
  !isTransforming.value &&
  !isReusableReady.value
));

const transformButtonLabel = computed(() => {
  if (isTransforming.value) {
    return 'Making reusable...';
  }

  if (isReusableReady.value) {
    return 'Reusable help is ready';
  }

  return 'Make this help reusable';
});

const transformStatusText = computed(() => {
  if (isTransforming.value) {
    return `Preserving ${helperDisplayName.value}'s source video and shaping reusable guidance.`;
  }

  if (isReusableReady.value) {
    return `${helperDisplayName.value}'s answer can now help the next person.`;
  }

  return videoAccepted.value ? `${helperDisplayName.value}'s video is selected as the source.` : `Start from ${helperDisplayName.value}'s answer.`;
});

const loadRequest = async () => {
  if (!routeId.value) {
    return;
  }

  isRequestLoading.value = true;
  requestLoadError.value = '';

  try {
    const apiRequest = await $fetch<HelpRequest>(`/api/help/requests/${encodeURIComponent(routeId.value)}`);
    request.value = mapHelpRequestToSummary(apiRequest);
  } catch (error) {
    console.error('Help request failed to load', error);
    request.value = null;
    requestLoadError.value = 'We could not load this help request.';
  } finally {
    isRequestLoading.value = false;
  }
};

const openVideoPicker = () => {
  videoInput.value?.click();
};

const handleVideoSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  processError.value = '';
  reuseStatus.value = 'idle';
  processedGuideId.value = '';

  if (!file) {
    selectedVideo.value = null;
    videoAccepted.value = false;
    return;
  }

  if (!['video/mp4', 'video/webm'].includes(file.type)) {
    selectedVideo.value = null;
    videoAccepted.value = false;
    processError.value = 'Please select an MP4 or WebM video.';
    input.value = '';
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    selectedVideo.value = null;
    videoAccepted.value = false;
    processError.value = 'Please select a video smaller than 20 MB.';
    input.value = '';
    return;
  }

  selectedVideo.value = file;
  videoAccepted.value = true;
};

const recordAgain = () => {
  videoAccepted.value = false;
  selectedVideo.value = null;
  reuseStatus.value = 'idle';
  processedGuideId.value = '';
  processError.value = '';

  if (videoInput.value) {
    videoInput.value.value = '';
  }
};

const makeHelpReusable = async () => {
  if (!canSubmitVideo.value || !selectedVideo.value || !request.value) {
    processError.value = 'Select a short source video before making this help reusable.';
    return;
  }

  processError.value = '';
  reuseStatus.value = 'transforming';

  try {
    const body = new FormData();
    body.append('requestId', request.value.id);
    body.append('helperName', helperName.value.trim());
    body.append('video', selectedVideo.value);

    const guide = await $fetch<HelpGuide>('/api/help/process', {
      method: 'POST',
      body,
    });

    processedGuideId.value = guide.id;
    reuseStatus.value = 'ready';
  } catch (error) {
    console.error('Reusable guide processing failed', error);
    reuseStatus.value = 'idle';
    processError.value = "We couldn't turn this demonstration into reusable help.";
  }
};

watch(routeId, loadRequest, { immediate: true });
</script>

<template>
  <main>
    <section v-if="request" class="hc-container space-y-8 py-10 sm:py-14 lg:py-16">
      <div class="grid gap-6 lg:grid-cols-[1fr_26rem] lg:items-start">
        <article class="hc-card min-w-0 overflow-hidden">
          <div class="p-5 sm:p-8">
            <div class="flex flex-wrap items-center gap-3">
              <StatusBadge tone="coral" dot>{{ request.status }}</StatusBadge>
              <span class="text-sm font-semibold text-hc-muted">{{ request.category }}</span>
            </div>

            <h1 class="hc-text-balance mt-6 max-w-3xl text-4xl font-semibold leading-tight text-hc-ink sm:text-5xl">
              {{ request.question }}
            </h1>

            <p class="mt-5 max-w-2xl text-base leading-8 text-hc-muted sm:text-lg">
              Asked by {{ request.askedBy }}. {{ request.detail }}
            </p>

            <div class="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-hc-line pt-5 text-sm font-semibold text-hc-ink">
              <span class="inline-flex items-center gap-2">
                <span class="flex size-8 items-center justify-center rounded-full bg-hc-emerald text-xs text-white">
                  {{ requesterName.charAt(0).toUpperCase() }}
                </span>
                {{ requesterName }} needs someone to show it
              </span>
              <span class="inline-flex items-center gap-2">
                <span class="size-2 rounded-full bg-hc-amber" />
                {{ request.helperNudge }}
              </span>
            </div>
          </div>

          <div class="border-t border-hc-line bg-hc-paper-soft p-5 sm:p-6">
            <div class="relative min-h-72 overflow-hidden rounded-[4px] border border-hc-line bg-hc-paper">
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 320" role="img" aria-label="A loose yarn loop collapsing before it becomes a slip knot">
                <path d="M82 210c62-90 187-94 230-18 34 61-31 126-91 79-54-42 8-135 96-89" fill="none" stroke="#0f5b49" stroke-linecap="round" stroke-width="9" />
                <path d="M244 260c-56 34-111 51-170 55" fill="none" stroke="#c5cebf" stroke-linecap="round" stroke-width="7" />
                <path d="M336 235c77 30 153 30 230-3" fill="none" stroke="#bf5b48" stroke-linecap="round" stroke-opacity="0.48" stroke-width="7" />
                <circle cx="316" cy="181" r="16" fill="#fffdf8" stroke="#0f5b49" stroke-width="5" />
                <circle cx="262" cy="236" r="8" fill="#c8892f" />
              </svg>

              <div class="absolute left-5 top-5 max-w-xs rounded-[4px] border border-hc-line bg-hc-paper/95 p-4 shadow-hc-soft">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">where it fails</p>
                <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">
                  The problem happens while {{ requesterName }} tries to follow the motion.
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside class="min-w-0 rounded-[4px] bg-hc-emerald p-6 text-white shadow-hc-card sm:p-8">
          <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase leading-5 text-white/75">
            Answer from {{ helperDisplayName }}
          </span>

          <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            {{ helperDisplayName }} can show the exact motion {{ requesterName }} needs.
          </h2>

          <p class="mt-4 text-base leading-8 text-white/75">
            The next step is not to replace {{ helperDisplayName }}. It is to turn their demonstration into a guide that keeps them attached as the source.
          </p>

          <div class="mt-8 rounded-[4px] bg-white/10 p-4">
            <p class="text-sm font-semibold leading-6 text-white">Source chain</p>
            <div class="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm font-semibold text-white/80">
              <span>{{ helperDisplayName }}</span>
              <span class="h-px bg-white/20" />
              <span>{{ requesterName }}</span>
              <span class="col-span-3 mx-auto h-8 w-px bg-white/20" />
              <span class="col-span-3 text-center text-white">future people</span>
            </div>
          </div>
        </aside>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
        <VideoPreview
          :label="`${helperDisplayName}'s answer`"
          :helper-name="helperDisplayName"
          :helper-initial="helperInitial"
          duration="0:20-0:30"
          :note="`${helperDisplayName}'s video is the source of everything that comes next. The guide starts from what they showed.`"
          primary-cta="Select video"
          secondary-cta="Clear video"
          @primary="openVideoPicker"
          @secondary="recordAgain"
        />
        <input
          ref="videoInput"
          class="sr-only"
          type="file"
          accept="video/mp4,video/webm"
          @change="handleVideoSelected"
        />

        <article
          class="relative min-w-0 overflow-hidden rounded-[4px] border bg-hc-paper p-6 shadow-hc-card sm:p-8"
          :class="videoAccepted ? 'border-hc-emerald' : 'border-hc-line'"
        >
          <div class="relative">
            <div class="flex items-center gap-3">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-sm font-semibold text-white">
                {{ helperInitial }}
              </span>
              <div>
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">from source video</p>
                <p class="text-base font-semibold leading-6 text-hc-ink">{{ helperDisplayName }}'s answer</p>
              </div>
            </div>

            <div class="my-10 flex justify-center">
              <div class="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">source</p>
                  <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">{{ selectedVideoName }}</p>
                </div>
                <div class="flex size-12 items-center justify-center rounded-full bg-hc-amber text-xl font-semibold text-hc-ink">
                  →
                </div>
                <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">reusable</p>
                  <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">steps, moments, audio</p>
                </div>
              </div>
            </div>

            <h2 class="hc-text-balance text-4xl font-semibold leading-tight text-hc-ink sm:text-5xl">
              Turn this answer into reusable help
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              HelpChain will organize your demonstration into clear steps while keeping your answer as the source.
            </p>

            <div class="mt-7 grid gap-5 rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
              <div>
                <label class="text-sm font-semibold leading-6 text-hc-ink" for="helper-name">
                  Helper name
                </label>
                <input
                  id="helper-name"
                  v-model="helperName"
                  class="hc-input mt-2 bg-hc-paper"
                  type="text"
                  maxlength="80"
                  autocomplete="name"
                  :disabled="isTransforming || isReusableReady"
                />
              </div>

              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm font-semibold leading-6 text-hc-ink">Source video</p>
                  <p class="mt-1 text-sm leading-6 text-hc-muted">{{ selectedVideoName }}</p>
                </div>
                <AppButton variant="secondary" size="sm" type="button" :disabled="isTransforming || isReusableReady" @click="openVideoPicker">
                  Choose video
                </AppButton>
              </div>
            </div>

            <button
              class="group relative mt-9 min-h-16 w-full overflow-hidden rounded-[4px] bg-hc-ink px-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(20,31,27,0.22)] transition duration-300 hover:bg-[#0d1713] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald disabled:cursor-wait disabled:opacity-80 sm:text-lg"
              type="button"
              :aria-busy="isTransforming"
              :disabled="!canSubmitVideo"
              @click="makeHelpReusable"
            >
              <span class="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true">
                <svg class="h-full w-full" viewBox="0 0 420 72">
                  <path d="M22 37h192c52 0 78-20 116-20M214 37c45 0 73 17 116 17" fill="none" stroke="#c8892f" stroke-linecap="round" stroke-width="2" />
                </svg>
              </span>
              <span class="relative inline-flex items-center justify-center gap-3">
                {{ transformButtonLabel }}
                <svg class="size-5 transition duration-300 group-hover:translate-x-1" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M6 16h18M17 9l7 7-7 7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" />
                </svg>
              </span>
            </button>

            <div class="mt-3 h-1 overflow-hidden rounded-full bg-hc-emerald-soft" aria-hidden="true">
              <div
                class="h-full rounded-full bg-hc-emerald transition-all duration-700"
                :class="isTransforming || isReusableReady ? 'w-full' : videoAccepted ? 'w-1/2' : 'w-12'"
              />
            </div>

            <p class="mt-4 text-sm font-semibold leading-6 text-hc-emerald" role="status" aria-live="polite">
              {{ transformStatusText }}
            </p>
            <p v-if="processError" class="mt-3 text-sm font-semibold leading-6 text-hc-coral" role="alert">
              {{ processError }}
            </p>
          </div>
        </article>
      </div>

      <Transition name="hc-discovery">
        <ProcessingProgress
          v-if="showProcessingMoment"
          :heading="'Making one act of help reusable…'"
          :steps="processingSteps"
          :helper-name="helperDisplayName"
          duration="0:20-0:30"
          :ready="isReusableReady"
          completion-title="Your help can now help others."
          completion-cta="View reusable guide"
          :guide-path="guidePath"
        />
      </Transition>
    </section>

    <section v-else class="hc-container py-16">
      <div class="hc-card max-w-2xl p-6 sm:p-8" role="status" aria-live="polite">
        <StatusBadge :tone="requestLoadError ? 'coral' : 'emerald'">
          {{ requestLoadError ? 'Request unavailable' : 'Loading request' }}
        </StatusBadge>
        <h1 class="mt-5 text-3xl font-semibold leading-tight text-hc-ink">
          {{ requestLoadError || 'Loading this help request...' }}
        </h1>
        <p v-if="!requestLoadError" class="mt-4 text-base leading-7 text-hc-muted">
          Getting the request so a human answer can be attached to it.
        </p>
        <AppButton v-else to="/#people-need-help" variant="secondary" size="md" class="mt-6">
          See open requests
        </AppButton>
      </div>
    </section>
  </main>
</template>
