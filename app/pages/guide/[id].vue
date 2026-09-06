<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  defaultGuideImpact,
  mapHelpGuideToReusableGuide,
  sponsorMoments,
  type HelpGuide,
  type HelpImpact,
  type ReusableGuide,
} from '~/data/helpchain';

const route = useRoute();

const apiGuide = ref<HelpGuide | null>(null);
const guideImpact = ref<HelpImpact>(defaultGuideImpact);
const activeStepId = ref('');
const helpedJoined = ref(false);
const isGuideLoading = ref(false);
const guideError = ref('');

const routeId = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  return String(id || '');
});

const routeMatchPercent = computed(() => {
  const match = Array.isArray(route.query.match) ? route.query.match[0] : route.query.match;
  const parsed = Number(match || 0);

  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, Math.round(parsed))) : 0;
});

const guide = computed<ReusableGuide | null>(() => {
  if (!apiGuide.value) {
    return null;
  }

  return mapHelpGuideToReusableGuide(apiGuide.value, guideImpact.value, routeMatchPercent.value);
});

const activeStep = computed(() => guide.value?.steps.find((step) => step.id === activeStepId.value) ?? guide.value?.steps[0]);

const activeMoment = computed(() => {
  if (!activeStep.value) {
    return '';
  }

  return `Step ${activeStep.value.number}: ${activeStep.value.timeRange}`;
});

const loadGuide = async () => {
  if (!routeId.value) {
    return;
  }

  isGuideLoading.value = true;
  guideError.value = '';
  helpedJoined.value = false;

  try {
    const [guideResult, impactResult] = await Promise.all([
      $fetch<HelpGuide>(`/api/help/guides/${encodeURIComponent(routeId.value)}`),
      $fetch<HelpImpact>(`/api/help/guides/${encodeURIComponent(routeId.value)}/impact`),
    ]);

    apiGuide.value = guideResult;
    guideImpact.value = impactResult;
  } catch (error) {
    console.error('Reusable guide failed to load', error);
    apiGuide.value = null;
    guideImpact.value = defaultGuideImpact;
    guideError.value = 'We could not load this reusable guide.';
  } finally {
    isGuideLoading.value = false;
  }
};

const handleHelped = (joined: boolean) => {
  if (!joined || helpedJoined.value) {
    return;
  }

  helpedJoined.value = true;
  guideImpact.value = {
    ...guideImpact.value,
    peopleHelped: guideImpact.value.peopleHelped + 1,
  };
};

watch(routeId, loadGuide, { immediate: true });

watch(guide, (currentGuide) => {
  if (!currentGuide?.steps.length) {
    activeStepId.value = '';
    return;
  }

  if (!currentGuide.steps.some((step) => step.id === activeStepId.value)) {
    activeStepId.value = currentGuide.steps[0].id;
  }
});
</script>

<template>
  <main>
    <template v-if="guide">
      <section class="hc-container py-10 sm:py-14 lg:py-16">
        <div class="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <div class="max-w-3xl">
            <StatusBadge tone="emerald" dot>{{ guide.badge }}</StatusBadge>
            <h1 class="hc-text-balance mt-6 text-5xl font-semibold leading-[0.96] text-hc-ink sm:text-6xl lg:text-7xl">
              {{ guide.title }}
            </h1>
            <p class="mt-6 max-w-2xl text-lg leading-8 text-hc-muted sm:text-xl">
              {{ guide.supportingLine }}
            </p>
          </div>

          <ImpactStat
            class="hidden lg:block"
            :helper-name="guide.helperName"
            :helped-count="guide.helpedCount"
          />
        </div>
      </section>

      <section class="hc-container pb-12 lg:pb-16">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start">
          <div class="min-w-0 lg:sticky lg:top-28">
            <VideoPreview
              :label="`${guide.helperName}'s answer`"
              :helper-name="guide.helperName"
              :helper-initial="guide.helperInitial"
              :duration="guide.duration"
              :active-moment="activeMoment"
              :note="`Every step on this page is extracted from ${guide.helperName}'s original answer. The video remains the source.`"
              compact
            />

            <section class="mt-5 rounded-[4px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft">
              <h2 class="text-xl font-semibold leading-7 text-hc-ink">You'll need</h2>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="material in guide.materials"
                  :key="material"
                  class="rounded-full border border-hc-line bg-hc-paper-soft px-4 py-2 text-sm font-semibold text-hc-ink"
                >
                  {{ material }}
                </span>
              </div>
            </section>
          </div>

          <div class="relative min-w-0">
            <div class="absolute -left-6 bottom-8 top-20 hidden w-px bg-hc-line-strong lg:block" aria-hidden="true" />
            <StatusBadge tone="amber">Steps extracted from {{ guide.helperName }}'s video</StatusBadge>
            <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
              Follow the moments {{ guide.helperName }} showed.
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-8 text-hc-muted">
              Each instruction keeps its timestamp attached, so the written guide points back to the exact motion in {{ guide.helperName }}'s video.
            </p>

            <div class="mt-7 grid gap-4">
              <GuideStep
                v-for="step in guide.steps"
                :key="step.id"
                :step="step"
                :active="activeStepId === step.id"
                @select="activeStepId = $event"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="hc-container pb-12 lg:pb-16">
        <AudioPlayer :guide-id="guide.id" />
      </section>

      <section class="hc-container pb-12 lg:hidden">
        <ImpactStat :helper-name="guide.helperName" :helped-count="guide.helpedCount" />
      </section>

      <section class="hc-container pb-12 lg:pb-16">
        <GenerosityGraph
          :helper-name="guide.helperName"
          :helped-count="guide.helpedCount"
          :languages="guide.languages"
          :duration="guide.duration"
          :recipients="guide.recipients"
          :show-new-node="helpedJoined"
        />
      </section>

      <section v-if="guide.matchPercent > 0" class="hc-container pb-12 lg:pb-16">
        <MatchBanner :match-percent="guide.matchPercent" :text="guide.matchText" />
      </section>

      <section class="hc-container pb-12 lg:pb-16">
        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="moment in sponsorMoments"
            :key="moment.provider"
            class="rounded-[4px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft"
          >
            <p class="text-sm font-semibold leading-6 text-hc-ink">{{ moment.label }}</p>
            <p class="mt-1 text-xs font-semibold uppercase leading-4 text-hc-muted">{{ moment.provider }}</p>
            <p class="mt-4 text-sm leading-6 text-hc-muted">{{ moment.text }}</p>
          </article>
        </div>
      </section>

      <section class="hc-container pb-12 lg:pb-16">
        <HelpedCard
          :guide-id="guide.id"
          :initial-count="guide.helpedCount"
          :helper-name="guide.helperName"
          :original-recipient="guide.originalRecipient"
          @helped="handleHelped"
        />
      </section>

      <section class="border-t border-hc-line bg-hc-emerald py-14 text-white sm:py-20">
        <div class="hc-container">
          <div class="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div>
              <p class="text-4xl font-semibold leading-tight sm:text-5xl">
                Someone helped you.
              </p>
              <p class="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-white/80 sm:text-5xl">
                Maybe you know something that could help someone else.
              </p>
              <AppButton to="/#people-need-help" variant="amber" size="lg" class="mt-8 w-full sm:w-auto">
                See people who need help
              </AppButton>
            </div>

            <div class="rounded-[4px] border border-white/15 bg-white/10 p-5">
              <div class="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
                <div class="rounded-[4px] bg-white/10 p-4">
                  <p class="text-sm font-semibold uppercase leading-5 text-white/60">receive help</p>
                  <p class="mt-2 text-xl font-semibold leading-7">Watch {{ guide.helperName }}'s answer</p>
                </div>
                <div class="hidden h-px w-8 bg-white/30 sm:block" />
                <div class="rounded-[4px] bg-white/10 p-4">
                  <p class="text-sm font-semibold uppercase leading-5 text-white/60">benefit</p>
                  <p class="mt-2 text-xl font-semibold leading-7">Solve the problem</p>
                </div>
                <div class="hidden h-px w-8 bg-white/30 sm:block" />
                <div class="rounded-[4px] bg-white/10 p-4">
                  <p class="text-sm font-semibold uppercase leading-5 text-white/60">help someone else</p>
                  <p class="mt-2 text-xl font-semibold leading-7">Record what you know</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <section v-else class="hc-container py-16">
      <div class="hc-card max-w-2xl p-6 sm:p-8" role="status" aria-live="polite">
        <StatusBadge :tone="guideError ? 'coral' : 'emerald'">
          {{ guideError ? 'Guide unavailable' : 'Loading guide' }}
        </StatusBadge>
        <h1 class="mt-5 text-3xl font-semibold leading-tight text-hc-ink">
          {{ guideError || 'Loading this reusable guide...' }}
        </h1>
        <p v-if="!guideError" class="mt-4 text-base leading-7 text-hc-muted">
          Getting the human-created steps and impact.
        </p>
        <AppButton v-else to="/#find-help" variant="secondary" size="md" class="mt-6">
          Search shared help
        </AppButton>
      </div>
    </section>
  </main>
</template>
