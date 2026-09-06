<script setup lang="ts">
import { computed, ref } from 'vue';
import { reusableGuide, sponsorMoments } from '~/data/helpchain';

const route = useRoute();

const guide = computed(() => {
  const routeId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

  return routeId === reusableGuide.id ? reusableGuide : reusableGuide;
});

const activeStepId = ref(reusableGuide.steps[0]?.id ?? '');
const helpedJoined = ref(false);

const activeStep = computed(() => guide.value.steps.find((step) => step.id === activeStepId.value) ?? guide.value.steps[0]);
const activeMoment = computed(() => {
  if (!activeStep.value) {
    return '';
  }

  return `Step ${activeStep.value.number}: ${activeStep.value.timeRange}`;
});
</script>

<template>
  <main>
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
            label="John's answer"
            :helper-name="guide.helperName"
            :helper-initial="guide.helperInitial"
            :duration="guide.duration"
            :active-moment="activeMoment"
            note="Every step on this page is extracted from John's original answer. The video remains the source."
            compact
          />

          <section class="mt-5 rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft">
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
          <StatusBadge tone="amber">Steps extracted from John's video</StatusBadge>
          <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
            Follow the moments John showed.
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-8 text-hc-muted">
            Each instruction keeps its timestamp attached, so the written guide points back to the exact motion in John's video.
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
      <AudioPlayer />
    </section>

    <section class="hc-container pb-12 lg:hidden">
      <ImpactStat :helper-name="guide.helperName" :helped-count="guide.helpedCount" />
    </section>

    <section class="hc-container pb-12 lg:pb-16">
      <GenerosityGraph
        :helper-name="guide.helperName"
        :helped-count="guide.helpedCount"
        :languages="guide.languages"
        :show-new-node="helpedJoined"
      />
    </section>

    <section class="hc-container pb-12 lg:pb-16">
      <MatchBanner :match-percent="guide.matchPercent" :text="guide.matchText" />
    </section>

    <section class="hc-container pb-12 lg:pb-16">
      <div class="grid gap-4 md:grid-cols-3">
        <article
          v-for="moment in sponsorMoments"
          :key="moment.provider"
          class="rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-soft"
        >
          <p class="text-sm font-semibold leading-6 text-hc-ink">{{ moment.label }}</p>
          <p class="mt-1 text-xs font-semibold uppercase leading-4 text-hc-muted">{{ moment.provider }}</p>
          <p class="mt-4 text-sm leading-6 text-hc-muted">{{ moment.text }}</p>
        </article>
      </div>
    </section>

    <section class="hc-container pb-12 lg:pb-16">
      <HelpedCard
        :initial-count="guide.helpedCount"
        :helper-name="guide.helperName"
        :original-recipient="guide.originalRecipient"
        @helped="helpedJoined = $event"
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

          <div class="rounded-[8px] border border-white/15 bg-white/10 p-5">
            <div class="grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              <div class="rounded-[8px] bg-white/10 p-4">
                <p class="text-sm font-semibold uppercase leading-5 text-white/60">receive help</p>
                <p class="mt-2 text-xl font-semibold leading-7">Watch John's answer</p>
              </div>
              <div class="hidden h-px w-8 bg-white/30 sm:block" />
              <div class="rounded-[8px] bg-white/10 p-4">
                <p class="text-sm font-semibold uppercase leading-5 text-white/60">benefit</p>
                <p class="mt-2 text-xl font-semibold leading-7">Solve the problem</p>
              </div>
              <div class="hidden h-px w-8 bg-white/30 sm:block" />
              <div class="rounded-[8px] bg-white/10 p-4">
                <p class="text-sm font-semibold uppercase leading-5 text-white/60">help someone else</p>
                <p class="mt-2 text-xl font-semibold leading-7">Record what you know</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
