<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { SearchResultGuide } from '~/data/helpchain';

type SearchState = 'idle' | 'searching' | 'found' | 'empty';

const props = withDefaults(
  defineProps<{
    initialQuery: string;
    result: SearchResultGuide;
    initialState?: SearchState;
  }>(),
  {
    initialState: 'found',
  },
);

const searchQuery = ref(props.initialQuery);
const searchState = ref<SearchState>(props.initialState);
let discoveryTimer: ReturnType<typeof setTimeout> | undefined;

const isFinding = computed(() => searchState.value === 'searching');
const hasFoundSharedHelp = computed(() => searchState.value === 'found');
const hasNoDonatedSolution = computed(() => searchState.value === 'empty');

const matchesPreservedPlantHelp = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  const plantSignals = ['houseplant', 'plant', 'pothos', 'yellow', 'leaves', 'dirt', 'soil', 'water'];
  const signalCount = plantSignals.filter((signal) => normalizedQuery.includes(signal)).length;

  return signalCount >= 2;
};

const findSharedHelp = () => {
  if (!searchQuery.value.trim() || isFinding.value) {
    return;
  }

  const submittedQuery = searchQuery.value;
  searchState.value = 'searching';
  clearTimeout(discoveryTimer);

  discoveryTimer = setTimeout(() => {
    searchState.value = matchesPreservedPlantHelp(submittedQuery) ? 'found' : 'empty';
  }, 520);
};

watch(searchQuery, () => {
  if (searchState.value === 'found' || searchState.value === 'empty') {
    searchState.value = 'idle';
  }
});

onBeforeUnmount(() => {
  clearTimeout(discoveryTimer);
});
</script>

<template>
  <div id="find-help" class="max-w-3xl">
    <form
      class="rounded-[4px] border border-hc-line bg-hc-paper p-2 shadow-hc-card sm:p-3"
      aria-label="Search for existing shared help"
      @submit.prevent="findSharedHelp"
    >
      <div class="flex flex-col gap-2 sm:flex-row">
        <label class="sr-only" for="help-search">What do you need help with?</label>
        <input
          id="help-search"
          v-model="searchQuery"
          class="hc-input min-h-14 rounded-[4px] border-transparent bg-hc-paper-soft px-4 text-base shadow-none disabled:cursor-wait disabled:opacity-80 focus:border-hc-emerald sm:min-h-16 sm:px-5"
          type="search"
          placeholder="What do you need help with?"
          :disabled="isFinding"
        />
        <AppButton
          variant="primary"
          size="lg"
          type="submit"
          :disabled="isFinding"
          :aria-busy="isFinding"
          class="shrink-0"
        >
          {{ isFinding ? 'Finding...' : 'Find existing help' }}
        </AppButton>
      </div>
    </form>

    <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="max-w-md text-sm font-medium leading-6 text-hc-muted">
        Searches answers people have already shared before creating a new request.
      </p>
      <AppButton to="/ask" variant="secondary" size="sm">
        Ask for Help
      </AppButton>
    </div>

    <Transition name="hc-discovery" mode="out-in">
      <SearchResultCard
        v-if="hasFoundSharedHelp"
        key="found"
        class="mt-8"
        :result="result"
        role="status"
        aria-live="polite"
      />

      <div
        v-else-if="hasNoDonatedSolution"
        key="empty"
        class="hc-card mt-8 p-5 sm:p-7"
        role="status"
        aria-live="polite"
      >
        <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div class="max-w-xl">
            <StatusBadge tone="coral">First answer needed</StatusBadge>
            <h2 class="hc-text-balance mt-5 text-2xl font-semibold leading-tight text-hc-ink sm:text-3xl">
              No donated solution found yet.
            </h2>
            <p class="mt-4 text-base leading-7 text-hc-muted sm:text-lg">
              Ask the community and help create the first reusable answer for the next person.
            </p>
          </div>

          <AppButton to="/ask" size="md">
            Ask for help
          </AppButton>
        </div>
      </div>

      <div
        v-else-if="isFinding"
        key="searching"
        class="hc-card mt-8 max-w-2xl p-6"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-center gap-4">
          <span class="relative flex size-12 items-center justify-center rounded-full bg-hc-emerald-wash">
            <span class="hc-ripple absolute inset-2" />
            <span class="size-2 rounded-full bg-hc-emerald" />
          </span>
          <div>
            <p class="text-lg font-semibold leading-6 text-hc-ink">Looking through shared answers.</p>
            <p class="mt-1 text-sm leading-6 text-hc-muted">Searching for a person who already showed a similar fix.</p>
          </div>
        </div>
      </div>

      <div
        v-else
        key="idle"
        class="mt-8 grid gap-5 border-y border-hc-line py-7 text-hc-muted sm:grid-cols-3"
      >
        <div>
          <p class="text-5xl font-semibold leading-none text-hc-emerald">27s</p>
          <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">one shared answer</p>
        </div>
        <div class="border-t border-hc-line pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <p class="text-5xl font-semibold leading-none text-hc-emerald">18</p>
          <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">people helped later</p>
        </div>
        <div class="border-t border-hc-line pt-5 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <p class="text-5xl font-semibold leading-none text-hc-emerald">3</p>
          <p class="mt-3 text-lg font-semibold leading-6 text-hc-ink">languages reached</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
