<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

type ReusableFormat = {
  label: string;
  tone: string;
};

type IllustrationPath = {
  d: string;
  color: string;
  opacity?: string;
  width: string;
};

type ProcessingStep = {
  label: string;
  provider?: string;
  symbol: '✓' | '●' | '○';
  status: 'complete' | 'active' | 'queued';
};

type HelpRequestPage = {
  id: string;
  badge: string;
  title: string;
  description: string;
  askerName: string;
  askerInitial: string;
  category: string;
  visualAlt: string;
  visualPaths: IllustrationPath[];
  visualMarkers: Array<{
    cx: string;
    cy: string;
    r: string;
    fill: string;
    stroke?: string;
    strokeWidth?: string;
  }>;
  failureLabel: string;
  failureText: string;
  demonstrationNudge: string;
  helper: {
    badge: string;
    heading: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    supportingText: string;
    privacyLabel: string;
    privacyNote: string;
  };
  humanAnswer: {
    label: string;
    helperName: string;
    helperInitial: string;
    duration: string;
    sourceNote: string;
    visualAlt: string;
    primaryCta: string;
    secondaryCta: string;
  };
  transform: {
    heading: string;
    text: string;
    primaryCta: string;
    idleStatus: string;
    transformingStatus: string;
    readyStatus: string;
    processingHeading: string;
    processingSteps: ProcessingStep[];
    completionTitle: string;
    completionCta: string;
  };
  reuse: {
    sourceLabel: string;
    heading: string;
    text: string;
    formats: ReusableFormat[];
    futureReach: string[];
  };
};

const route = useRoute();

const defaultRequest: HelpRequestPage = {
  id: '1',
  badge: 'Needs help',
  title: 'How do I make a slip knot without it collapsing?',
  description: "The loop keeps falling apart when I tighten it. I'm not sure where I'm crossing the yarn incorrectly.",
  askerName: 'Anna',
  askerInitial: 'A',
  category: 'Crafts',
  visualAlt: 'A loose yarn loop collapsing as it is tightened',
  visualPaths: [
    {
      d: 'M82 195c62-90 187-94 230-18 34 61-31 126-91 79-54-42 8-135 96-89',
      color: '#0f4f3d',
      width: '9',
    },
    {
      d: 'M244 245c-56 34-111 51-170 55',
      color: '#d7c9b7',
      width: '7',
    },
    {
      d: 'M336 220c77 30 153 30 230-3',
      color: '#c9674b',
      opacity: '0.48',
      width: '7',
    },
  ],
  visualMarkers: [
    {
      cx: '316',
      cy: '166',
      r: '16',
      fill: '#fffdf8',
      stroke: '#0f4f3d',
      strokeWidth: '5',
    },
    {
      cx: '262',
      cy: '220',
      r: '8',
      fill: '#d89b3d',
    },
  ],
  failureLabel: 'where it fails',
  failureText: 'The loop collapses while Anna tightens the yarn.',
  demonstrationNudge: 'A close hand demo would answer this.',
  helper: {
    badge: 'Human answer needed',
    heading: 'Know how to solve this?',
    text: 'A short demonstration could help more than one person.',
    primaryCta: 'Record an answer',
    secondaryCta: 'Upload video',
    supportingText: 'Around 20–30 seconds works best.',
    privacyLabel: 'Privacy note',
    privacyNote: 'Show the task or object rather than personal information whenever possible.',
  },
  humanAnswer: {
    label: "John's human answer",
    helperName: 'John',
    helperInitial: 'J',
    duration: '0:27',
    sourceNote: 'John shows the yarn crossing and tightening motion before AI organizes anything.',
    visualAlt: 'John demonstrating a slip knot with yarn on a table',
    primaryCta: 'Use this video',
    secondaryCta: 'Record again',
  },
  transform: {
    heading: 'Turn this answer into reusable help',
    text: 'AI will organize your demonstration into clear steps while keeping your human answer as the source.',
    primaryCta: 'Make this help reusable',
    idleStatus: 'Ready to transform the human demo.',
    transformingStatus: 'Preserving the source and shaping reusable guidance.',
    readyStatus: 'Reusable help flow started from John’s answer.',
    processingHeading: 'Making one act of help reusable…',
    processingSteps: [
      {
        label: 'Human answer received',
        symbol: '✓',
        status: 'complete',
      },
      {
        label: 'Understanding the demonstration',
        provider: 'Google Gemini',
        symbol: '✓',
        status: 'complete',
      },
      {
        label: 'Finding important moments',
        symbol: '●',
        status: 'active',
      },
      {
        label: 'Creating reusable steps',
        symbol: '○',
        status: 'queued',
      },
      {
        label: 'Preparing accessible narration',
        provider: 'ElevenLabs',
        symbol: '○',
        status: 'queued',
      },
      {
        label: 'Adding the help to the reusable knowledge library',
        provider: 'Snowflake',
        symbol: '○',
        status: 'queued',
      },
    ],
    completionTitle: 'Your help can now help others.',
    completionCta: 'View reusable guide',
  },
  reuse: {
    sourceLabel: 'You',
    heading: 'What one answer can become',
    text: 'AI can reshape the human demo into reusable guidance while the helper remains the source.',
    formats: [
      { label: 'watch', tone: 'bg-hc-emerald text-white' },
      { label: 'follow', tone: 'bg-hc-paper text-hc-ink' },
      { label: 'read', tone: 'bg-hc-paper text-hc-ink' },
      { label: 'listen', tone: 'bg-hc-paper text-hc-ink' },
    ],
    futureReach: ['Anna', 'Carlos', 'Mei', 'Sara', 'Kim'],
  },
};

const helpRequests: Record<string, HelpRequestPage> = {
  [defaultRequest.id]: defaultRequest,
};

const requestId = computed(() => {
  const routeId = route.params.id;

  return Array.isArray(routeId) ? routeId[0] : routeId;
});

const request = computed<HelpRequestPage>(() => helpRequests[requestId.value || defaultRequest.id] ?? defaultRequest);

const reuseStatus = ref<'idle' | 'transforming' | 'ready'>('idle');
let reuseTimer: ReturnType<typeof setTimeout> | undefined;

const isTransforming = computed(() => reuseStatus.value === 'transforming');
const isReusableReady = computed(() => reuseStatus.value === 'ready');
const showProcessingMoment = computed(() => reuseStatus.value !== 'idle');

const visibleProcessingSteps = computed<ProcessingStep[]>(() => {
  if (!isReusableReady.value) {
    return request.value.transform.processingSteps;
  }

  return request.value.transform.processingSteps.map((step): ProcessingStep => ({
    ...step,
    symbol: '✓',
    status: 'complete',
  }));
});

const processingStepClass = (status: ProcessingStep['status']) => {
  const classes = {
    complete: 'bg-hc-emerald text-white',
    active: 'bg-hc-amber text-hc-ink',
    queued: 'bg-hc-canvas text-hc-ink',
  };

  return classes[status];
};

const transformButtonLabel = computed(() => {
  if (reuseStatus.value === 'transforming') {
    return 'Making reusable...';
  }

  if (reuseStatus.value === 'ready') {
    return 'Reusable help started';
  }

  return request.value.transform.primaryCta;
});

const transformStatusText = computed(() => {
  if (reuseStatus.value === 'transforming') {
    return request.value.transform.transformingStatus;
  }

  if (reuseStatus.value === 'ready') {
    return request.value.transform.readyStatus;
  }

  return request.value.transform.idleStatus;
});

const makeHelpReusable = () => {
  if (isTransforming.value) {
    return;
  }

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
        <article class="min-w-0 rounded-[8px] bg-hc-paper p-6 shadow-hc-card sm:p-8">
          <div class="flex flex-wrap items-center gap-3">
            <span class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">
              <span class="size-2 rounded-full bg-hc-coral" />
              {{ request.badge }}
            </span>
            <span class="text-sm font-semibold text-hc-muted">{{ request.category }}</span>
          </div>

          <h1 class="hc-text-balance mt-6 max-w-3xl text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl lg:text-5xl">
            {{ request.title }}
          </h1>

          <p class="mt-5 max-w-2xl text-base leading-8 text-hc-muted sm:text-lg">
            {{ request.description }}
          </p>

          <div class="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-hc-line pt-5 text-sm font-semibold text-hc-ink">
            <span class="inline-flex items-center gap-2">
              <span class="flex size-8 items-center justify-center rounded-full bg-hc-emerald text-xs text-white">
                {{ request.askerInitial }}
              </span>
              Asked by {{ request.askerName }}
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="size-2 rounded-full bg-hc-amber" />
              {{ request.category }}
            </span>
          </div>

          <div class="mt-7 rounded-[8px] bg-hc-paper-soft p-4 sm:p-5">
            <div class="h-52 sm:h-60">
              <svg class="h-full w-full" viewBox="0 0 620 300" role="img" :aria-label="request.visualAlt">
                <path
                  v-for="path in request.visualPaths"
                  :key="path.d"
                  :d="path.d"
                  fill="none"
                  :stroke="path.color"
                  stroke-linecap="round"
                  :stroke-opacity="path.opacity"
                  :stroke-width="path.width"
                />
                <circle
                  v-for="marker in request.visualMarkers"
                  :key="`${marker.cx}-${marker.cy}-${marker.r}`"
                  :cx="marker.cx"
                  :cy="marker.cy"
                  :r="marker.r"
                  :fill="marker.fill"
                  :stroke="marker.stroke"
                  :stroke-width="marker.strokeWidth"
                />
              </svg>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <p class="text-sm font-semibold leading-6 text-hc-ink">
                <span class="block text-xs uppercase leading-4 text-hc-muted">{{ request.failureLabel }}</span>
                {{ request.failureText }}
              </p>
              <p class="text-sm font-semibold leading-6 text-hc-emerald">
                <span class="block text-xs uppercase leading-4 text-hc-muted">Best response</span>
                {{ request.demonstrationNudge }}
              </p>
            </div>
          </div>
        </article>

        <aside class="min-w-0 rounded-[8px] bg-hc-emerald p-6 text-white shadow-hc-card sm:p-8">
          <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase leading-5 text-white/75">
            {{ request.helper.badge }}
          </span>

          <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            {{ request.helper.heading }}
          </h2>

          <p class="mt-4 text-base leading-8 text-white/75">
            {{ request.helper.text }}
          </p>

          <div id="record" class="mt-8 space-y-3">
            <button class="hc-button min-h-16 w-full rounded-[8px] bg-hc-amber px-6 text-lg font-semibold text-hc-ink shadow-[0_18px_36px_rgba(0,0,0,0.2)] hover:bg-[#e2aa4f] focus-visible:outline-white" type="button">
              <svg class="size-6 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M8 11.5A4.5 4.5 0 0 1 12.5 7h7A4.5 4.5 0 0 1 24 11.5v9a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 8 20.5v-9Z" fill="none" stroke="currentColor" stroke-width="2" />
                <path d="m24 14 5-3v10l-5-3" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2" />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
              {{ request.helper.primaryCta }}
            </button>

            <button class="hc-button min-h-12 w-full rounded-[8px] bg-white/10 px-6 text-base font-semibold text-white hover:bg-white/20 focus-visible:outline-white" type="button">
              <svg class="size-5 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9 23h14M16 7v12M10 13l6-6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" />
              </svg>
              {{ request.helper.secondaryCta }}
            </button>
          </div>

          <div class="mt-6 space-y-4 text-sm leading-6 text-white/75">
            <p class="font-semibold text-white">{{ request.helper.supportingText }}</p>
            <p>
              <span class="block text-xs font-semibold uppercase leading-4 text-white/50">{{ request.helper.privacyLabel }}</span>
              {{ request.helper.privacyNote }}
            </p>
          </div>
        </aside>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <article class="min-w-0 rounded-[8px] bg-hc-paper p-6 shadow-hc-card sm:p-8">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">
                {{ request.humanAnswer.label }}
              </span>
              <h2 class="mt-4 text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
                This human demonstration is the source.
              </h2>
            </div>

            <div class="flex items-center gap-3 text-sm font-semibold text-hc-ink">
              <span class="flex size-10 items-center justify-center rounded-full bg-hc-emerald text-xs text-white">
                {{ request.humanAnswer.helperInitial }}
              </span>
              <span>helper: {{ request.humanAnswer.helperName }}</span>
              <span class="rounded-full bg-hc-paper-soft px-3 py-1">{{ request.humanAnswer.duration }}</span>
            </div>
          </div>

          <div class="mt-6 overflow-hidden rounded-[8px] bg-[#ebe1d2]">
            <div class="relative aspect-video">
              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 760 430" role="img" :aria-label="request.humanAnswer.visualAlt">
                <rect x="78" y="72" width="604" height="286" rx="18" fill="#fffdf8" opacity="0.58" />
                <path d="M122 287c108-112 258-108 316-16 45 72-28 145-111 90-77-51-9-168 105-114" fill="none" stroke="#0f4f3d" stroke-linecap="round" stroke-width="13" />
                <path d="M150 319c-45 20-82 31-119 34" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="10" />
                <path d="M442 316c88 35 176 35 266-2" fill="none" stroke="#c9674b" stroke-linecap="round" stroke-opacity="0.5" stroke-width="10" />
                <path d="M214 124c44-42 97-47 142-14 15 11 22 27 16 42-8 20-38 24-62 8-31-21-63-21-96 0" fill="#f5ded6" stroke="#c9674b" stroke-linejoin="round" stroke-width="3" />
                <path d="M474 120c54-35 112-31 151 9 13 14 17 31 8 45-12 18-42 16-63-4-27-25-61-29-102-11" fill="#edf6f1" stroke="#0f4f3d" stroke-linejoin="round" stroke-width="3" />
                <circle cx="404" cy="263" r="18" fill="#fffdf8" stroke="#0f4f3d" stroke-width="6" />
                <circle cx="350" cy="320" r="9" fill="#d89b3d" />
              </svg>

            </div>
          </div>

          <p class="mt-4 max-w-2xl text-sm font-semibold leading-6 text-hc-muted">
            {{ request.humanAnswer.sourceNote }}
          </p>

          <div class="mt-5 flex flex-col gap-3 sm:flex-row">
            <button class="hc-button hc-button-primary min-h-12 rounded-[8px] px-5" type="button">
              {{ request.humanAnswer.primaryCta }}
            </button>
            <button class="hc-button hc-button-secondary min-h-12 rounded-[8px] px-5" type="button">
              {{ request.humanAnswer.secondaryCta }}
            </button>
          </div>
        </article>

        <article class="min-w-0 rounded-[8px] bg-hc-paper p-6 shadow-hc-card sm:p-8">
          <div class="flex items-center gap-3">
            <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-sm font-semibold text-white">
              {{ request.humanAnswer.helperInitial }}
            </span>
            <div>
              <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">from human source</p>
              <p class="text-base font-semibold leading-6 text-hc-ink">{{ request.humanAnswer.label }}</p>
            </div>
          </div>

          <div class="my-8 rounded-[8px] bg-hc-paper-soft p-5">
            <svg class="h-24 w-full" viewBox="0 0 520 120" aria-hidden="true">
              <path d="M72 60h138c45 0 68-38 118-38" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="3" />
              <path d="M210 60c54 0 72 0 126 0" fill="none" stroke="#0f4f3d" stroke-linecap="round" stroke-width="4" />
              <path d="M210 60c45 0 70 38 118 38" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="3" />
              <circle cx="72" cy="60" r="14" fill="#0f4f3d" />
              <circle cx="328" cy="22" r="9" fill="#c9674b" />
              <circle cx="336" cy="60" r="10" fill="#d89b3d" />
              <circle cx="328" cy="98" r="9" fill="#0f4f3d" />
              <path d="M352 22h96M362 60h86M352 98h96" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="2" />
            </svg>
          </div>

          <h2 class="hc-text-balance text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
            {{ request.transform.heading }}
          </h2>
          <p class="mt-5 text-base leading-8 text-hc-muted">
            {{ request.transform.text }}
          </p>

          <div class="mt-7 grid gap-3 sm:grid-cols-3">
            <div class="rounded-[8px] bg-hc-paper-soft p-4">
              <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">source</p>
              <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">{{ request.humanAnswer.helperName }}'s video</p>
            </div>
            <div class="rounded-[8px] bg-hc-paper-soft p-4">
              <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">AI organizes</p>
              <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">steps and captions</p>
            </div>
            <div class="rounded-[8px] bg-hc-paper-soft p-4">
              <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">people reuse</p>
              <p class="mt-2 text-sm font-semibold leading-6 text-hc-ink">watch, read, listen</p>
            </div>
          </div>

          <button
            class="hc-button mt-8 min-h-16 w-full rounded-[8px] px-6 text-base font-semibold text-white shadow-[0_18px_40px_rgba(15,79,61,0.24)] focus-visible:outline-hc-emerald sm:text-lg"
            :class="reuseStatus === 'ready' ? 'bg-hc-emerald hover:bg-hc-emerald' : 'bg-hc-ink hover:bg-[#11140f]'"
            type="button"
            :aria-busy="isTransforming"
            :disabled="isTransforming"
            @click="makeHelpReusable"
          >
            <Transition name="hc-discovery" mode="out-in">
              <span :key="reuseStatus">
                {{ transformButtonLabel }}
              </span>
            </Transition>
          </button>

          <div class="mt-3 h-1 overflow-hidden rounded-full bg-hc-emerald-soft" aria-hidden="true">
            <div
              class="h-full rounded-full bg-hc-emerald transition-all duration-700"
              :class="isTransforming || reuseStatus === 'ready' ? 'w-full' : 'w-12'"
            />
          </div>

          <p class="mt-4 text-sm font-semibold leading-6 text-hc-emerald" role="status" aria-live="polite">
            {{ transformStatusText }}
          </p>
        </article>
      </div>

      <Transition name="hc-discovery">
        <article
          v-if="showProcessingMoment"
          class="rounded-[8px] bg-hc-ink p-6 shadow-hc-card sm:p-8 lg:p-10"
          aria-live="polite"
        >
          <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div class="min-w-0">
              <p class="text-sm font-semibold uppercase leading-5 text-hc-amber-soft">Processing transformation</p>
              <h2 class="hc-text-balance mt-4 max-w-xl text-4xl font-semibold leading-tight text-hc-paper sm:text-5xl">
                {{ request.transform.processingHeading }}
              </h2>
              <p class="mt-5 max-w-xl text-base leading-8 text-hc-paper-soft sm:text-lg">
                One human video is becoming structured reusable knowledge, while {{ request.humanAnswer.helperName }} remains the source.
              </p>

              <div class="mt-9 grid gap-4 sm:grid-cols-3 sm:items-center">
                <div class="rounded-[8px] bg-hc-paper p-5 text-hc-ink shadow-hc-soft">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Human video</p>
                  <p class="mt-3 text-2xl font-semibold leading-none">{{ request.humanAnswer.duration }}</p>
                  <p class="mt-2 text-sm font-semibold leading-6">helper: {{ request.humanAnswer.helperName }}</p>
                </div>

                <div class="flex min-h-20 flex-col items-center justify-center gap-2 text-center">
                  <svg class="h-16 w-28 sm:h-14 sm:w-full" viewBox="0 0 160 72" aria-hidden="true">
                    <path class="hidden sm:block" d="M14 36h92" fill="none" stroke="#d89b3d" stroke-linecap="round" stroke-width="4" />
                    <path class="hidden sm:block" d="m98 22 24 14-24 14" fill="none" stroke="#d89b3d" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                    <path class="hidden sm:block" d="M122 36c14 0 18-12 26-18M122 36c14 0 18 12 26 18" fill="none" stroke="#d7c9b7" stroke-linecap="round" stroke-width="2" />
                    <path class="sm:hidden" d="M80 8v38" fill="none" stroke="#d89b3d" stroke-linecap="round" stroke-width="4" />
                    <path class="sm:hidden" d="m66 40 14 24 14-24" fill="none" stroke="#d89b3d" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                    <circle class="hidden sm:block" cx="14" cy="36" r="5" fill="#fffdf8" />
                    <circle class="hidden sm:block" cx="80" cy="36" r="4" fill="#fffdf8" opacity="0.72" />
                    <circle class="hidden sm:block" cx="148" cy="18" r="4" fill="#fffdf8" opacity="0.78" />
                    <circle class="hidden sm:block" cx="148" cy="54" r="4" fill="#fffdf8" opacity="0.78" />
                    <circle class="sm:hidden" cx="80" cy="8" r="5" fill="#fffdf8" />
                    <circle class="sm:hidden" cx="80" cy="64" r="5" fill="#fffdf8" />
                  </svg>
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-amber-soft">
                    AI organizes
                  </p>
                </div>

                <div class="rounded-[8px] p-5 bg-hc-paper text-hc-ink shadow-hc-soft">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Structured reusable knowledge</p>
                  <p class="mt-3 text-2xl font-semibold leading-none">3 steps</p>
                  <p class="mt-2 text-sm font-semibold leading-6">watch, read, listen</p>
                </div>
              </div>

              <div class="mt-6 grid gap-3 sm:grid-cols-3">
                <div class="rounded-[8px] bg-white p-4 text-hc-paper">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-line-strong">Step 1</p>
                  <p class="mt-2 text-sm font-semibold leading-6">Cross the yarn</p>
                </div>
                <div class="rounded-[8px] bg-white p-4 text-hc-paper">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-line-strong">Step 2</p>
                  <p class="mt-2 text-sm font-semibold leading-6">Pull through the loop</p>
                </div>
                <div class="rounded-[8px] bg-white p-4 text-hc-paper">
                  <p class="text-xs font-semibold uppercase leading-4 text-hc-line-strong">Step 3</p>
                  <p class="mt-2 text-sm font-semibold leading-6">Tighten cleanly</p>
                </div>
              </div>
            </div>

            <div class="min-w-0 rounded-[8px] bg-hc-paper p-4 shadow-hc-soft sm:p-5" style="background-color: #fffdf8; color: #20231f;">
              <ol class="grid gap-3 sm:grid-cols-2">
                <li
                  v-for="step in visibleProcessingSteps"
                  :key="step.label"
                  class="grid min-w-0 grid-cols-[1.75rem_1fr] gap-3 rounded-[8px] bg-hc-paper-soft p-3"
                >
                  <span
                    class="flex size-7 items-center justify-center rounded-full text-xs font-semibold"
                    :class="processingStepClass(step.status)"
                  >
                    {{ step.symbol }}
                  </span>
                  <span class="min-w-0">
                    <span class="block text-sm font-semibold leading-5" style="color: #20231f;">{{ step.label }}</span>
                    <span v-if="step.provider" class="mt-0.5 block text-[0.68rem] font-semibold uppercase leading-4" style="color: #777167;">
                      {{ step.provider }}
                    </span>
                  </span>
                </li>
              </ol>

              <Transition name="hc-discovery">
                <div v-if="isReusableReady" class="mt-5 rounded-[8px] bg-hc-emerald p-4 text-white">
                  <p class="text-xl font-semibold leading-tight">{{ request.transform.completionTitle }}</p>
                  <button class="hc-button mt-4 min-h-11 rounded-[8px] bg-hc-paper px-4 text-sm font-semibold text-hc-emerald hover:bg-white focus-visible:outline-white" type="button">
                    {{ request.transform.completionCta }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </article>
      </Transition>
    </section>
  </main>
</template>
