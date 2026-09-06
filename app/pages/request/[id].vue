<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { openRequest, processingSteps, reusableGuide } from '~/data/helpchain';

const route = useRoute();

const request = computed(() => {
  const routeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  return routeId === openRequest.id ? openRequest : openRequest;
});

const videoAccepted = ref(false);
const reuseStatus = ref<'idle' | 'transforming' | 'ready'>('idle');
let reuseTimer: ReturnType<typeof setTimeout> | undefined;

const isTransforming = computed(() => reuseStatus.value === 'transforming');
const isReusableReady = computed(() => reuseStatus.value === 'ready');
const showProcessingMoment = computed(() => reuseStatus.value !== 'idle');

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
    return "Preserving John's source video and shaping reusable guidance.";
  }

  if (isReusableReady.value) {
    return "John's answer can now help the next person.";
  }

  return videoAccepted.value ? "John's video is selected as the source." : "Start from John's human answer.";
});

const markVideoAccepted = () => {
  videoAccepted.value = true;
};

const recordAgain = () => {
  videoAccepted.value = false;
  reuseStatus.value = 'idle';
  clearTimeout(reuseTimer);
};

const makeHelpReusable = () => {
  if (isTransforming.value) {
    return;
  }

  videoAccepted.value = true;
  reuseStatus.value = 'transforming';
  clearTimeout(reuseTimer);

  reuseTimer = setTimeout(() => {
    reuseStatus.value = 'ready';
  }, 1600);
};

onBeforeUnmount(() => {
  clearTimeout(reuseTimer);
});
</script>

<template>
  <main>
    <section class="hc-container space-y-8 py-10 sm:py-14 lg:py-16">
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
                  A
                </span>
                Anna needs a human demonstration
              </span>
              <span class="inline-flex items-center gap-2">
                <span class="size-2 rounded-full bg-hc-amber" />
                {{ request.helperNudge }}
              </span>
            </div>
          </div>

          <div class="border-t border-hc-line bg-hc-paper-soft p-5 sm:p-6">
            <div class="relative min-h-72 overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper">
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 320" role="img" aria-label="A loose yarn loop collapsing before it becomes a slip knot">
                <path d="M82 210c62-90 187-94 230-18 34 61-31 126-91 79-54-42 8-135 96-89" fill="none" stroke="#0f5b49" stroke-linecap="round" stroke-width="9" />
                <path d="M244 260c-56 34-111 51-170 55" fill="none" stroke="#c5cebf" stroke-linecap="round" stroke-width="7" />
                <path d="M336 235c77 30 153 30 230-3" fill="none" stroke="#bf5b48" stroke-linecap="round" stroke-opacity="0.48" stroke-width="7" />
                <circle cx="316" cy="181" r="16" fill="#fffdf8" stroke="#0f5b49" stroke-width="5" />
                <circle cx="262" cy="236" r="8" fill="#c8892f" />
              </svg>

              <div class="absolute left-5 top-5 max-w-xs rounded-[8px] border border-hc-line bg-hc-paper/95 p-4 shadow-hc-soft">
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">where it fails</p>
                <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">
                  The loop collapses while Anna tightens the yarn.
                </p>
              </div>
            </div>
          </div>
        </article>

        <aside class="min-w-0 rounded-[8px] bg-hc-emerald p-6 text-white shadow-hc-card sm:p-8">
          <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase leading-5 text-white/75">
            Human answer ready
          </span>

          <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            John showed the exact motion Anna needed.
          </h2>

          <p class="mt-4 text-base leading-8 text-white/75">
            The next step is not to replace John. It is to turn his demonstration into a guide that keeps him attached as the source.
          </p>

          <div class="mt-8 rounded-[8px] bg-white/10 p-4">
            <p class="text-sm font-semibold leading-6 text-white">Source chain</p>
            <div class="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3 text-sm font-semibold text-white/80">
              <span>John</span>
              <span class="h-px bg-white/20" />
              <span>Anna</span>
              <span class="col-span-3 mx-auto h-8 w-px bg-white/20" />
              <span class="col-span-3 text-center text-white">future people</span>
            </div>
          </div>
        </aside>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
        <VideoPreview
          label="John's human answer"
          helper-name="John"
          helper-initial="J"
          duration="0:27"
          note="John's human demonstration is the source of everything that comes next. AI has not rewritten it yet."
          primary-cta="Use this video"
          secondary-cta="Record again"
          @primary="markVideoAccepted"
          @secondary="recordAgain"
        />

        <article
          class="relative min-w-0 overflow-hidden rounded-[8px] border bg-hc-paper p-6 shadow-hc-card sm:p-8"
          :class="videoAccepted ? 'border-hc-emerald' : 'border-hc-line'"
        >
          <svg class="absolute inset-x-0 top-0 h-44 w-full text-hc-emerald/20" viewBox="0 0 620 180" aria-hidden="true">
            <path d="M82 70c114 3 128 56 226 56s122-76 230-73" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
            <path d="M308 126c-42 0-62 27-92 48M308 126c47 0 65 26 104 47" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" />
            <circle cx="82" cy="70" r="8" fill="currentColor" />
            <circle cx="308" cy="126" r="10" fill="currentColor" />
            <circle cx="538" cy="53" r="8" fill="currentColor" />
          </svg>

          <div class="relative">
            <div class="flex items-center gap-3">
              <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-sm font-semibold text-white">
                J
              </span>
              <div>
                <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">from human source</p>
                <p class="text-base font-semibold leading-6 text-hc-ink">John's human answer</p>
              </div>
            </div>

            <div class="my-10 flex justify-center">
              <div class="grid w-full max-w-md grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-4">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">source</p>
                  <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">John's 0:27 video</p>
                </div>
                <div class="flex size-12 items-center justify-center rounded-full bg-hc-amber text-xl font-semibold text-hc-ink">
                  →
                </div>
                <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-4">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">reusable</p>
                  <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">steps, moments, audio</p>
                </div>
              </div>
            </div>

            <h2 class="hc-text-balance text-4xl font-semibold leading-tight text-hc-ink sm:text-5xl">
              Turn this answer into reusable help
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              AI will organize your demonstration into clear steps while keeping your human answer as the source.
            </p>

            <button
              class="group relative mt-9 min-h-16 w-full overflow-hidden rounded-[8px] bg-hc-ink px-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(20,31,27,0.22)] transition duration-300 hover:bg-[#0d1713] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald disabled:cursor-wait disabled:opacity-80 sm:text-lg"
              type="button"
              :aria-busy="isTransforming"
              :disabled="isTransforming"
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
          </div>
        </article>
      </div>

      <Transition name="hc-discovery">
        <ProcessingProgress
          v-if="showProcessingMoment"
          :heading="'Making one act of help reusable…'"
          :steps="processingSteps"
          helper-name="John"
          duration="0:27"
          :ready="isReusableReady"
          completion-title="Your help can now help others."
          completion-cta="View reusable guide"
          :guide-path="`/guide/${reusableGuide.id}`"
        />
      </Transition>
    </section>
  </main>
</template>
