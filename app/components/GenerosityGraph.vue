<script setup lang="ts">
import { computed } from 'vue';

type Recipient = {
  anonymousId: string;
  displayName?: string;
};

const props = withDefaults(
  defineProps<{
    helperName: string;
    helpedCount: number;
    languages: number;
    duration?: string;
    recipients?: Recipient[];
    showNewNode?: boolean;
  }>(),
  {
    duration: 'one answer',
    recipients: () => [],
    showNewNode: false,
  },
);

const recipientPositions = [
  'left-[20%] top-[58%]',
  'left-1/2 top-[61%]',
  'left-[80%] top-[58%]',
];
const displayCount = computed(() => props.helpedCount);
const helperInitial = computed(() => props.helperName.charAt(0).toUpperCase() || 'H');
const visibleRecipients = computed(() => props.recipients.slice(0, 3).map((recipient, index) => {
  const displayName = recipient.displayName || `Person ${index + 1}`;

  return {
    ...recipient,
    displayName,
    initial: displayName.charAt(0).toUpperCase() || 'P',
    position: recipientPositions[index],
  };
}));
const additionalCount = computed(() => Math.max(0, displayCount.value - visibleRecipients.value.length - (props.showNewNode ? 1 : 0)));
</script>

<template>
  <section class="overflow-hidden rounded-[4px] border border-hc-line bg-hc-paper shadow-hc-card">
    <div class="grid gap-0 lg:grid-cols-[0.48fr_0.52fr]">
      <div class="border-b border-hc-line p-5 sm:p-8 lg:border-b-0 lg:border-r">
        <StatusBadge tone="emerald" dot>Generosity graph</StatusBadge>
        <h2 class="hc-text-balance mt-5 text-4xl font-semibold leading-tight text-hc-ink sm:text-5xl">
          One answer. {{ displayCount }} people.
        </h2>
        <p class="mt-5 max-w-md text-base leading-8 text-hc-muted sm:text-lg">
          How {{ helperName }}'s {{ duration }} of help kept moving.
        </p>

        <div class="mt-8 grid grid-cols-1 gap-3 text-center sm:grid-cols-3 lg:grid-cols-1 lg:text-left xl:grid-cols-3 xl:text-center">
          <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
            <p class="text-3xl font-semibold leading-none text-hc-emerald">1</p>
            <p class="mt-2 text-xs font-semibold uppercase leading-4 text-hc-muted">shared answer</p>
          </div>
          <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
            <p class="text-3xl font-semibold leading-none text-hc-emerald">{{ displayCount }}</p>
            <p class="mt-2 text-xs font-semibold uppercase leading-4 text-hc-muted">people helped</p>
          </div>
          <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-4">
            <p class="text-3xl font-semibold leading-none text-hc-emerald">{{ languages }}</p>
            <p class="mt-2 text-xs font-semibold uppercase leading-4 text-hc-muted">languages</p>
          </div>
        </div>

        <div class="mt-6 rounded-[4px] border border-hc-line bg-hc-paper-soft p-4 text-center">
          <p class="text-base font-semibold leading-6 text-hc-ink">1 shared answer</p>
          <p class="py-2 text-xl font-semibold leading-none text-hc-emerald">↓</p>
          <p class="text-base font-semibold leading-6 text-hc-ink">{{ displayCount }} people helped</p>
          <p class="py-2 text-xl font-semibold leading-none text-hc-emerald">↓</p>
          <p class="text-base font-semibold leading-6 text-hc-ink">{{ languages }} languages</p>
        </div>
      </div>

      <div class="relative min-h-[31rem] bg-hc-paper-soft p-5 sm:p-8">
        <div class="hidden h-full min-h-[27rem] sm:block">
          <svg class="absolute inset-0 h-full w-full" viewBox="0 0 620 500" role="img" :aria-label="`${helperName}'s answer reaching people`">
            <path class="hc-line-draw" d="M310 94 C234 150 178 213 132 302" fill="none" stroke="#cbbba8" stroke-width="3" stroke-linecap="round" />
            <path class="hc-line-draw hc-delay-1" d="M310 94 C308 172 306 236 304 315" fill="none" stroke="#cbbba8" stroke-width="3" stroke-linecap="round" />
            <path class="hc-line-draw hc-delay-2" d="M310 94 C386 150 442 213 488 302" fill="none" stroke="#cbbba8" stroke-width="3" stroke-linecap="round" />
            <path class="hc-line-draw hc-delay-3" d="M132 302 C184 360 236 388 304 402" fill="none" stroke="#d89b3d" stroke-width="2.4" stroke-linecap="round" />
            <path class="hc-line-draw hc-delay-4" d="M488 302 C434 366 382 393 304 402" fill="none" stroke="#d89b3d" stroke-width="2.4" stroke-linecap="round" />
            <path v-if="showNewNode" class="hc-line-draw" d="M304 402 C360 424 410 430 465 416" fill="none" stroke="#0f5b49" stroke-width="3" stroke-linecap="round" />
          </svg>

          <div class="absolute left-1/2 top-12 z-10 -translate-x-1/2 text-center">
            <div class="mx-auto flex size-20 items-center justify-center rounded-full bg-hc-emerald text-3xl font-semibold text-white shadow-hc-button">
              {{ helperInitial }}
            </div>
            <p class="mt-3 text-sm font-semibold uppercase leading-5 text-hc-ink">{{ helperName }}</p>
            <p class="text-xs font-semibold leading-4 text-hc-muted">original helper</p>
          </div>

          <div
            v-for="recipient in visibleRecipients"
            :key="recipient.anonymousId"
            class="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center"
            :class="recipient.position"
          >
            <div class="hc-node mx-auto">{{ recipient.initial }}</div>
            <p class="mt-2 text-sm font-semibold text-hc-ink">{{ recipient.displayName }}</p>
          </div>

          <div v-if="additionalCount > 0" class="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 rounded-[4px] border border-hc-line bg-hc-paper px-5 py-3 text-center shadow-hc-soft">
            <p class="text-sm font-semibold leading-5 text-hc-ink">+{{ additionalCount }} more people helped</p>
          </div>

          <Transition name="hc-node-pop">
            <div v-if="showNewNode" class="absolute bottom-14 right-10 z-10 text-center">
              <div class="hc-node mx-auto bg-hc-emerald text-white">Y</div>
              <p class="mt-2 text-sm font-semibold text-hc-ink">You</p>
            </div>
          </Transition>
        </div>

        <div class="grid gap-4 sm:hidden">
          <div class="flex items-center gap-4 rounded-[4px] bg-hc-paper p-4">
            <div class="flex size-12 items-center justify-center rounded-full bg-hc-emerald text-lg font-semibold text-white">{{ helperInitial }}</div>
            <div>
              <p class="text-sm font-semibold uppercase leading-5 text-hc-muted">{{ helperName }}</p>
              <p class="text-base font-semibold leading-6 text-hc-ink">original helper</p>
            </div>
          </div>
          <div class="ml-6 h-8 w-px bg-hc-line-strong" />
          <div v-if="visibleRecipients.length" class="grid grid-cols-3 gap-2 text-center">
            <div
              v-for="recipient in visibleRecipients"
              :key="recipient.anonymousId"
              class="rounded-[4px] bg-hc-paper p-3"
            >
              <div class="hc-node mx-auto">{{ recipient.initial }}</div>
              <p class="mt-2 text-xs font-semibold text-hc-ink">{{ recipient.displayName }}</p>
            </div>
          </div>
          <p v-if="additionalCount > 0" class="rounded-[4px] border border-hc-line bg-hc-paper px-4 py-3 text-center text-sm font-semibold text-hc-ink">
            +{{ additionalCount }} more people helped
          </p>
          <Transition name="hc-node-pop">
            <p v-if="showNewNode" class="rounded-[4px] bg-hc-emerald px-4 py-3 text-center text-sm font-semibold text-white">
              You joined this path.
            </p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
