<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

type SearchState = 'idle' | 'searching' | 'found' | 'empty';

type HelpRequest = {
  id: string;
  routePath: string;
  question: string;
  category: string;
  badge: string;
  helperNudge: string;
  detail: string;
  iconPath: string;
  illustrationPaths: string[];
  accentColor: string;
  washColor: string;
};

const searchQuery = ref('My houseplant leaves keep turning yellow and the dirt never dries.');
const searchState = ref<SearchState>('idle');

const helpRequests: HelpRequest[] = [
  {
    id: 'slip-knot',
    routePath: '/request/1',
    question: 'How do I make a slip knot without it collapsing?',
    category: 'Crafts',
    badge: 'Needs a human answer',
    helperNudge: 'A close-up hand demo would solve this quickly.',
    detail: 'Mira is stuck on the first loop before starting a scarf.',
    iconPath: 'M7 7c5 7 13 7 18 0M10 20c4-8 12-8 16 0M13 13h10',
    illustrationPaths: [
      'M62 88c31-40 88-37 104 0 12 28-19 54-48 31-23-19 4-56 42-41',
      'M86 118c-18 18-35 31-55 40',
      'M152 119c20 17 34 31 49 48',
    ],
    accentColor: '#0f4f3d',
    washColor: '#edf6f1',
  },
  {
    id: 'origami-corner',
    routePath: '/request/1',
    question: 'How do I fold an origami corner so both edges line up?',
    category: 'Paper',
    badge: 'Needs a human answer',
    helperNudge: 'A slow fold from above would make the angle obvious.',
    detail: 'Niko keeps getting one side longer than the other.',
    iconPath: 'M7 7h20L13 27 7 7Zm6 20 4-10 10-10',
    illustrationPaths: [
      'M48 162 118 45l70 117H48Z',
      'M118 45v117',
      'M48 162l70-52 70 52',
    ],
    accentColor: '#c9674b',
    washColor: '#f5ded6',
  },
  {
    id: 'shirt-button',
    routePath: '/request/1',
    question: 'How do I fix a loose shirt button before it falls off?',
    category: 'Sewing',
    badge: 'Needs a human answer',
    helperNudge: 'Someone could show the knot and stitch tension.',
    detail: 'Ana has the needle threaded but cannot secure the button.',
    iconPath: 'M17 7v20M7 17h20M11 11l12 12M23 11 11 23',
    illustrationPaths: [
      'M83 65h82v82H83z',
      'M103 85h42M103 105h42M103 125h42',
      'M58 172c32-42 94-38 132-2',
    ],
    accentColor: '#d89b3d',
    washColor: '#f7ead0',
  },
  {
    id: 'plant-propagation',
    routePath: '/request/1',
    question: 'How do I propagate a plant without the cutting rotting?',
    category: 'Plants',
    badge: 'Needs a human answer',
    helperNudge: 'A real example could show where to cut and when to water.',
    detail: 'Sam has a cutting in water but the stem keeps turning soft.',
    iconPath: 'M17 28V11M17 18c-6 0-9-4-10-9 6 0 9 3 10 9Zm0 4c6 0 9-4 10-9-6 0-9 3-10 9Z',
    illustrationPaths: [
      'M118 178V66',
      'M118 105c-34-2-52-22-57-48 34 0 52 17 57 48Z',
      'M119 135c37-1 58-23 65-56-36 0-57 19-65 56Z',
      'M88 184h61',
    ],
    accentColor: '#0f4f3d',
    washColor: '#edf6f1',
  },
];

let discoveryTimer: number | undefined;

const isFinding = computed(() => searchState.value === 'searching');
const hasFoundHumanHelp = computed(() => searchState.value === 'found');
const hasNoDonatedSolution = computed(() => searchState.value === 'empty');

const matchesPreservedPlantHelp = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  const plantSignals = ['houseplant', 'plant', 'pothos', 'yellow', 'leaves', 'dirt', 'soil', 'water'];
  const signalCount = plantSignals.filter((signal) => normalizedQuery.includes(signal)).length;

  return signalCount >= 2;
};

const findHumanHelp = () => {
  if (!searchQuery.value.trim() || isFinding.value) {
    return;
  }

  const submittedQuery = searchQuery.value;

  searchState.value = 'searching';
  window.clearTimeout(discoveryTimer);
  discoveryTimer = window.setTimeout(() => {
    searchState.value = matchesPreservedPlantHelp(submittedQuery) ? 'found' : 'empty';
  }, 620);
};

watch(searchQuery, () => {
  if (searchState.value === 'found' || searchState.value === 'empty') {
    searchState.value = 'idle';
  }
});

onBeforeUnmount(() => {
  window.clearTimeout(discoveryTimer);
});
</script>

<template>
  <main>
      <section class="hc-container relative pb-16 pt-8 lg:pb-24 lg:pt-10">
        <div class="grid min-h-[calc(100vh-8.5rem)] items-center gap-12 lg:min-h-[42rem] lg:grid-cols-[1.04fr_0.96fr]">
          <div class="relative z-10 max-w-3xl">
            <span class="hc-badge">
              <span class="size-2 rounded-full bg-hc-coral" />
              Human help, made reusable
            </span>

            <h1 class="hc-text-balance mt-7 max-w-3xl text-5xl font-semibold leading-[0.94] text-hc-ink sm:text-6xl lg:text-5xl">
              Someone helped once.<br />
              Their help can keep helping.
            </h1>

            <p class="mt-7 max-w-xl text-lg leading-8 text-hc-muted sm:text-xl">
              Find solutions donated by real people - preserved and made reusable with AI.
            </p>

            <div id="ask" class="mt-10 max-w-2xl">
              <form id="find-help" class="rounded-[8px] border border-hc-line bg-hc-paper p-2 shadow-hc-card sm:p-3" aria-label="Search for existing help" @submit.prevent="findHumanHelp">
                <div class="flex flex-col gap-2 sm:flex-row">
                  <label class="sr-only" for="help-search">What do you need help with?</label>
                  <input
                    id="help-search"
                    v-model="searchQuery"
                    class="hc-input min-h-14 rounded-[8px] border-transparent bg-hc-paper-soft px-4 text-base shadow-none disabled:cursor-wait disabled:opacity-80 focus:border-hc-emerald sm:min-h-16 sm:px-5"
                    type="search"
                    placeholder="What do you need help with?"
                    :disabled="isFinding"
                  />
                  <button
                    class="hc-button hc-button-primary min-h-14 shrink-0 rounded-[8px] px-5 disabled:cursor-wait disabled:opacity-80 sm:min-h-16"
                    type="submit"
                    :disabled="isFinding"
                  >
                    {{ isFinding ? 'Finding...' : 'Find' }}
                  </button>
                </div>
              </form>

              <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p class="max-w-sm text-sm font-medium leading-6 text-hc-muted">
                  Searches human-created solutions, not AI-generated answers.
                </p>
                <NuxtLink to="/ask" class="hc-button hc-button-secondary min-h-11 rounded-[8px] px-4">
                  Ask for Help
                </NuxtLink>
              </div>
            </div>

            <Transition name="hc-discovery" mode="out-in">
              <div
                v-if="hasFoundHumanHelp"
                key="found"
                class="mt-12 max-w-3xl rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-card sm:p-7"
                role="status"
                aria-live="polite"
              >
                <div class="flex flex-col gap-5 border-b border-hc-line pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div class="max-w-xl">
                    <p class="hc-text-balance text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
                      Someone has already helped with something similar.
                    </p>
                    <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">
                      The closest preserved answer came from John, a real person who helped with the same pattern: yellow leaves, wet soil, and a pothos that needed time to recover.
                    </p>
                  </div>

                  <div class="w-fit rounded-full border border-hc-emerald/20 bg-hc-emerald-wash px-5 py-3 text-center">
                    <p class="text-3xl font-semibold leading-none text-hc-emerald sm:text-4xl">92%</p>
                    <p class="mt-1 text-xs font-semibold uppercase leading-4 text-hc-muted">match</p>
                  </div>
                </div>

                <div class="mt-6 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                  <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-5">
                    <div class="flex items-center gap-4">
                      <div class="flex size-16 shrink-0 items-center justify-center rounded-full bg-hc-emerald text-2xl font-semibold text-white shadow-hc-button">
                        J
                      </div>
                      <div>
                        <p class="text-xs font-semibold uppercase leading-4 text-hc-muted">Preserved human help from</p>
                        <p class="text-3xl font-semibold leading-none text-hc-ink">John</p>
                      </div>
                    </div>

                    <div class="mt-6 space-y-3 text-sm font-semibold text-hc-muted">
                      <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
                        <span>18 people helped</span>
                        <span class="size-2 rounded-full bg-hc-emerald" />
                      </div>
                      <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
                        <span>audio available</span>
                        <span class="size-2 rounded-full bg-hc-coral" />
                      </div>
                      <div class="flex items-center justify-between gap-4 border-t border-hc-line pt-3">
                        <span>3 languages</span>
                        <span class="size-2 rounded-full bg-hc-amber" />
                      </div>
                    </div>
                  </div>

                  <article class="relative overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper-soft p-5 sm:p-6">
                    <div class="absolute right-5 top-5 h-16 w-16 rounded-full border border-hc-emerald/10" />
                    <h2 class="max-w-md text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
                      Recovering an overwatered pothos
                    </h2>
                    <p class="mt-3 text-base font-semibold leading-7 text-hc-ink">
                      John helped someone with a similar problem.
                    </p>
                    <p class="mt-4 max-w-xl border-l-2 border-hc-emerald/30 pl-4 text-base leading-7 text-hc-muted sm:text-lg">
                      Check the roots, allow the soil to dry, and reduce watering frequency…
                    </p>

                    <a href="#help-someone" class="hc-button hc-button-primary mt-6 min-h-12 rounded-[8px] px-5">
                      See how John helped
                    </a>
                  </article>
                </div>
              </div>

              <div
                v-else-if="hasNoDonatedSolution"
                key="empty"
                class="mt-12 max-w-3xl rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-card sm:p-7"
                role="status"
                aria-live="polite"
              >
                <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div class="max-w-xl">
                    <div class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">First answer needed</div>
                    <h2 class="hc-text-balance mt-5 text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
                      No donated solution found yet.
                    </h2>
                    <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">
                      You can ask the community and help create the first reusable answer.
                    </p>
                  </div>

                  <NuxtLink to="/ask" class="hc-button hc-button-primary min-h-12 rounded-[8px] px-5">
                    Ask for help
                  </NuxtLink>
                </div>

                <div class="mt-7 grid gap-3 md:grid-cols-3">
                  <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-4">
                    <div class="flex size-9 items-center justify-center rounded-full bg-hc-coral-soft text-sm font-semibold text-hc-coral">1</div>
                    <p class="mt-4 text-lg font-semibold leading-6 text-hc-ink">Nothing found</p>
                    <p class="mt-2 text-sm leading-6 text-hc-muted">No person has donated this solution yet.</p>
                  </div>

                  <div class="relative rounded-[8px] border border-hc-line bg-hc-paper-soft p-4">
                    <div class="absolute -left-3 top-8 hidden h-px w-3 bg-hc-line md:block" />
                    <div class="flex size-9 items-center justify-center rounded-full bg-hc-emerald-wash text-sm font-semibold text-hc-emerald">2</div>
                    <p class="mt-4 text-lg font-semibold leading-6 text-hc-ink">Ask someone</p>
                    <p class="mt-2 text-sm leading-6 text-hc-muted">A real helper can record the first answer.</p>
                  </div>

                  <div class="relative rounded-[8px] border border-hc-line bg-hc-paper-soft p-4">
                    <div class="absolute -left-3 top-8 hidden h-px w-3 bg-hc-line md:block" />
                    <div class="flex size-9 items-center justify-center rounded-full bg-hc-amber-soft text-sm font-semibold text-hc-ink">3</div>
                    <p class="mt-4 text-lg font-semibold leading-6 text-hc-ink">Future people benefit</p>
                    <p class="mt-2 text-sm leading-6 text-hc-muted">Their answer may help future people too.</p>
                  </div>
                </div>
              </div>

              <div
                v-else-if="isFinding"
                key="searching"
                class="mt-12 max-w-2xl rounded-[8px] border border-hc-line bg-hc-paper p-6 shadow-hc-card"
                role="status"
                aria-live="polite"
              >
                <div class="flex items-center gap-4">
                  <span class="relative flex size-12 items-center justify-center rounded-full bg-hc-emerald-wash">
                    <span class="absolute size-7 rounded-full border border-hc-emerald/25" />
                    <span class="size-2 rounded-full bg-hc-emerald" />
                  </span>
                  <div>
                    <p class="text-lg font-semibold leading-6 text-hc-ink">Looking through preserved human help.</p>
                    <p class="mt-1 text-sm leading-6 text-hc-muted">Searching for a person who already showed a similar fix.</p>
                  </div>
                </div>
              </div>

              <div
                v-else
                key="idle"
                class="mt-12 grid max-w-3xl gap-7 border-y border-hc-line py-8 text-hc-muted sm:grid-cols-[1.08fr_0.9fr_0.9fr] sm:gap-0"
              >
                <div class="sm:pr-7">
                  <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-3xl lg:text-5xl">27s</p>
                  <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">one recorded answer</p>
                  <p class="mt-2 max-w-xs text-base leading-7">A real person shows the fix once.</p>
                </div>
                <div class="border-t border-hc-line pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                  <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-3xl lg:text-5xl">19</p>
                  <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">people helped later</p>
                  <p class="mt-2 max-w-xs text-base leading-7">The same contribution keeps spreading.</p>
                </div>
                <div class="border-t border-hc-line pt-6 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                  <p class="text-6xl font-semibold leading-none text-hc-emerald sm:text-3xl lg:text-5xl">4</p>
                  <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">reusable formats</p>
                  <p class="mt-2 max-w-xs text-base leading-7">Watch, follow, read, or listen.</p>
                </div>
              </div>
            </Transition>
          </div>

          <div class="relative z-10 mx-auto w-full max-w-[22rem] sm:max-w-[34rem] lg:mx-0 lg:justify-self-end" aria-label="One donated solution branching to people who need it">
            <div class="absolute -inset-5 rounded-full bg-hc-emerald/5 blur-3xl" />
            <div class="relative aspect-square overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper shadow-hc-card">
              <div class="absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,rgba(15,79,61,0.08),transparent_30%),linear-gradient(135deg,rgba(255,253,248,0.9),rgba(251,246,238,0.72))]" />
              <div class="absolute inset-[9%] rounded-full border border-hc-emerald/10" />
              <div class="absolute inset-[20%] rounded-full border border-hc-emerald/10" />

              <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 620" role="img" aria-label="Branching paths from one human demonstration to many people">
                <path d="M300 330 C250 300 215 265 146 226" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                <path d="M300 330 C346 264 408 222 506 174" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                <path d="M300 330 C244 372 209 424 152 506" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                <path d="M300 330 C365 365 430 430 516 482" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                <path d="M300 330 C303 257 324 187 371 102" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                <path d="M300 330 C338 345 369 368 405 402" fill="none" stroke="#0f4f3d" stroke-opacity="0.28" stroke-width="3" stroke-linecap="round" />
              </svg>

              <div class="absolute left-[49%] top-[52%] z-10 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hc-emerald/20 bg-hc-emerald p-3 text-center text-white shadow-hc-button sm:w-44 sm:p-5">
                <div class="mx-auto flex size-11 items-center justify-center rounded-full bg-white/12 text-xl font-semibold sm:size-16 sm:text-3xl">J</div>
                <p class="mt-2 text-xs font-semibold leading-4 sm:mt-3 sm:text-sm">John donated a fix</p>
                <p class="mt-1 text-[0.68rem] leading-3 text-white/72 sm:text-xs">human-created</p>
              </div>

              <div class="absolute left-[18%] top-[36%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">A</div>
                <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Anna</p>
              </div>
              <div class="absolute left-[82%] top-[27%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">C</div>
                <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Carlos</p>
              </div>
              <div class="absolute left-[22%] top-[76%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">M</div>
                <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Mei</p>
              </div>
              <div class="absolute left-[82%] top-[72%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">S</div>
                <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Sara</p>
              </div>
              <div class="absolute left-[60%] top-[15%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div class="hc-node">K</div>
                <p class="mt-1 text-center text-[0.68rem] font-medium leading-3 text-hc-muted sm:mt-2 sm:text-xs">Kim</p>
              </div>

              <div class="absolute left-[6%] top-[7%] z-10 max-w-[7.5rem] rounded-[8px] border border-hc-line bg-hc-paper/95 p-2 shadow-hc-soft sm:max-w-[11rem] sm:p-4">
                <p class="text-[0.62rem] font-semibold uppercase leading-3 text-hc-muted sm:text-xs sm:leading-4">Preserved with AI</p>
                <p class="mt-1 text-sm font-semibold leading-5 text-hc-ink sm:text-base">steps, captions, audio</p>
              </div>

              <div class="absolute bottom-[3%] right-[7%] z-10 rounded-full border border-hc-amber/30 bg-hc-amber-soft px-3 py-2 text-[0.68rem] font-semibold leading-3 text-hc-ink shadow-hc-soft sm:bottom-[6%] sm:px-4 sm:text-xs">
                19 people helped
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="hc-section border-y border-hc-line bg-hc-canvas">
        <div class="hc-container">
          <div class="grid gap-12 lg:grid-cols-[0.66fr_1.34fr] lg:items-center">
            <div class="max-w-md">
              <span class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">
                Living impact
              </span>
              <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
                Human help keeps moving
              </h2>
              <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
                Every count starts with a person who was stuck, then found a real answer someone else had taken the time to show.
              </p>
            </div>

            <div class="relative overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper px-5 py-8 shadow-hc-card sm:px-8 sm:py-10">
              <div class="absolute left-8 top-10 hidden h-[calc(100%-5rem)] w-px bg-hc-line md:block" />

              <div class="relative grid gap-7 md:grid-cols-[0.58fr_0.42fr] md:gap-10">
                <div>
                  <p class="text-7xl font-semibold leading-none text-hc-emerald sm:text-8xl lg:text-9xl">126</p>
                  <p class="mt-3 max-w-sm text-2xl font-semibold leading-8 text-hc-ink sm:text-3xl">
                    people helped
                  </p>
                </div>

                <div class="flex flex-col justify-center gap-5 text-hc-muted">
                  <p class="max-w-sm text-lg leading-8">
                    Each “this helped me” traces back to a human contribution that stayed useful after the first person received it.
                  </p>
                  <div class="hidden h-px w-24 bg-hc-line md:block" />
                </div>
              </div>

              <div class="relative mt-9 grid gap-6 border-t border-hc-line pt-7 md:grid-cols-[auto_1fr_auto_1fr] md:items-end">
                <div>
                  <p class="text-sm font-semibold uppercase leading-5 text-hc-muted">from</p>
                  <p class="mt-2 text-6xl font-semibold leading-none text-hc-ink sm:text-7xl">34</p>
                  <p class="mt-2 text-xl font-semibold leading-7 text-hc-ink">human solutions</p>
                </div>

                <div class="hidden h-px bg-hc-line md:block" />

                <div>
                  <p class="text-sm font-semibold uppercase leading-5 text-hc-muted">across</p>
                  <p class="mt-2 text-6xl font-semibold leading-none text-hc-ink sm:text-7xl">8</p>
                  <p class="mt-2 text-xl font-semibold leading-7 text-hc-ink">languages reached</p>
                </div>

                <div class="relative min-h-24 overflow-hidden rounded-[8px] border border-hc-line bg-hc-paper-soft">
                  <svg class="absolute inset-0 h-full w-full" viewBox="0 0 260 120" aria-hidden="true">
                    <path d="M30 74 C80 20 125 22 162 65" fill="none" stroke="#d7c9b7" stroke-width="2" stroke-linecap="round" />
                    <path d="M162 65 C185 92 211 96 236 75" fill="none" stroke="#0f4f3d" stroke-opacity="0.34" stroke-width="3" stroke-linecap="round" />
                    <circle cx="30" cy="74" r="6" fill="#0f4f3d" />
                    <circle cx="116" cy="32" r="5" fill="#c9674b" />
                    <circle cx="162" cy="65" r="6" fill="#0f4f3d" />
                    <circle cx="236" cy="75" r="5" fill="#d89b3d" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="people-need-help" class="hc-section border-y border-hc-line bg-hc-paper/54">
        <div class="hc-container">
          <div class="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div class="max-w-md">
              <span class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">
                Open requests
              </span>
              <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
                People who could use your help
              </h2>
              <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
                Small questions become reusable guidance when someone records the first clear human answer.
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="request in helpRequests"
                :key="request.id"
                class="hc-card group flex min-h-[28rem] flex-col overflow-hidden"
                :style="{ '--request-accent': request.accentColor, '--request-wash': request.washColor }"
              >
                <div class="relative h-36 overflow-hidden border-b border-hc-line bg-[var(--request-wash)]">
                  <div class="absolute inset-5 rounded-full border border-hc-line/70" />
                  <svg class="absolute inset-0 h-full w-full" viewBox="0 0 240 210" aria-hidden="true">
                    <path
                      v-for="path in request.illustrationPaths"
                      :key="path"
                      :d="path"
                      fill="none"
                      stroke="var(--request-accent)"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-opacity="0.72"
                      stroke-width="5"
                    />
                  </svg>

                  <div class="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full border border-hc-line bg-hc-paper text-[var(--request-accent)] shadow-hc-soft">
                    <svg class="size-6" viewBox="0 0 34 34" aria-hidden="true">
                      <path
                        :d="request.iconPath"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.4"
                      />
                    </svg>
                  </div>

                  <div class="absolute bottom-4 right-4 rounded-full border border-hc-line bg-hc-paper/92 px-3 py-1 text-xs font-semibold text-hc-muted shadow-hc-soft">
                    {{ request.category }}
                  </div>
                </div>

                <div class="flex flex-1 flex-col p-5">
                  <div class="flex items-center justify-between gap-3">
                    <span class="text-sm font-semibold text-[var(--request-accent)]">{{ request.category }}</span>
                    <span class="rounded-full border border-hc-line bg-hc-paper-soft px-3 py-1 text-[0.68rem] font-semibold uppercase leading-4 text-hc-muted">
                      {{ request.badge }}
                    </span>
                  </div>

                  <h3 class="mt-5 text-xl font-semibold leading-7 text-hc-ink">
                    {{ request.question }}
                  </h3>
                  <p class="mt-4 text-sm leading-6 text-hc-muted">
                    {{ request.detail }}
                  </p>

                  <div class="mt-auto pt-6">
                    <div class="border-t border-hc-line pt-4">
                      <p class="text-sm font-medium leading-6 text-hc-muted">
                        {{ request.helperNudge }}
                      </p>
                      <NuxtLink :to="request.routePath" class="hc-button hc-button-secondary mt-4 min-h-11 w-full rounded-[8px] px-4 group-hover:border-hc-emerald group-hover:text-hc-emerald">
                        I can help
                      </NuxtLink>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="help-someone" class="border-y border-hc-line bg-hc-paper/52 py-16 sm:py-20">
        <div class="hc-container grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div class="max-w-md">
            <div class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">Reusable help path</div>
            <h2 class="hc-text-balance mt-5 text-3xl font-semibold leading-tight text-hc-ink sm:text-4xl">
              From one answer to many forms of guidance.
            </h2>
            <p class="mt-5 text-base leading-8 text-hc-muted sm:text-lg">
              The layout keeps the source human visible while the product shows what AI adds around that contribution.
            </p>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <article class="hc-card p-6 sm:p-7 md:col-span-2 lg:mr-12">
              <div class="hc-badge border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald">Human source</div>
              <h3 class="mt-5 max-w-xl text-lg font-semibold leading-7 text-hc-ink sm:text-xl">A real person demonstrates the solution.</h3>
              <p class="mt-4 max-w-2xl text-base leading-7 text-hc-muted sm:text-lg">The original helper stays visible as the source of the knowledge.</p>
            </article>

            <article class="hc-card p-6 sm:p-7">
              <div class="hc-badge border-hc-coral/20 bg-hc-coral-soft text-hc-coral">AI amplification</div>
              <h3 class="mt-5 text-lg font-semibold leading-7 text-hc-ink sm:text-xl">AI reshapes the demo into reusable guidance.</h3>
              <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">The contribution becomes steps, captions, summaries, audio, and search context.</p>
            </article>

            <article id="reuse" class="hc-card p-6 sm:p-7 md:mt-10">
              <div class="hc-badge border-hc-amber/20 bg-hc-amber-soft text-hc-ink">Growing chain</div>
              <h3 class="mt-5 text-lg font-semibold leading-7 text-hc-ink sm:text-xl">Each “this helped me” extends the path.</h3>
              <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">One generous answer keeps spreading beyond the first person who asked.</p>
            </article>
          </div>
        </div>
      </section>
  </main>
</template>
