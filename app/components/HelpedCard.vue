<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    guideId: string;
    initialCount: number;
    helperName: string;
    originalRecipient: string;
    language?: string;
  }>(),
  {
    language: 'en',
  },
);

const emit = defineEmits<{
  helped: [joined: boolean];
}>();

const hasRecordedLocally = ref(false);
const hasJoinedThisSession = ref(false);
const isSubmitting = ref(false);
const helpedError = ref('');
const helpedCount = computed(() => props.initialCount);
const isDisabled = computed(() => hasRecordedLocally.value || isSubmitting.value);
const buttonLabel = computed(() => {
  if (isSubmitting.value) {
    return 'Recording...';
  }

  if (hasRecordedLocally.value) {
    return 'Help recorded';
  }

  return 'This helped me';
});

const recordedGuideKey = 'helpchain-recorded-guides';
const anonymousIdKey = 'helpchain-anonymous-id';

const markHelped = async () => {
  if (isDisabled.value) {
    return;
  }

  isSubmitting.value = true;
  helpedError.value = '';

  try {
    const result = await $fetch<{ recorded: boolean; reason?: string }>(`/api/help/guides/${encodeURIComponent(props.guideId)}/helped`, {
      method: 'POST',
      body: {
        anonymousId: getAnonymousId(),
        language: props.language,
      },
    });

    hasRecordedLocally.value = true;
    saveRecordedGuide(props.guideId);

    if (result.recorded) {
      hasJoinedThisSession.value = true;
      emit('helped', true);
      return;
    }

    helpedError.value = result.reason === 'already_recorded'
      ? 'This browser has already counted this guide.'
      : 'This help was already recorded.';
    emit('helped', false);
  } catch (error) {
    console.error('Helped event failed', error);
    helpedError.value = 'We could not record this right now.';
  } finally {
    isSubmitting.value = false;
  }
};

const getAnonymousId = () => {
  const existing = localStorage.getItem(anonymousIdKey);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID?.() || `browser-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  localStorage.setItem(anonymousIdKey, id);

  return id;
};

const getRecordedGuides = () => {
  try {
    return JSON.parse(localStorage.getItem(recordedGuideKey) || '[]') as string[];
  } catch {
    return [];
  }
};

const saveRecordedGuide = (guideId: string) => {
  const recordedGuides = new Set(getRecordedGuides());
  recordedGuides.add(guideId);
  localStorage.setItem(recordedGuideKey, JSON.stringify([...recordedGuides]));
};

const syncRecordedState = () => {
  hasRecordedLocally.value = getRecordedGuides().includes(props.guideId);
  hasJoinedThisSession.value = false;
  helpedError.value = '';
};

onMounted(syncRecordedState);

watch(() => props.guideId, syncRecordedState);
</script>

<template>
  <section class="rounded-[4px] border border-hc-line bg-hc-paper p-5 shadow-hc-card sm:p-7">
    <div class="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
      <div>
        <h2 class="text-3xl font-semibold leading-tight text-hc-ink">
          Did this solve your problem?
        </h2>
        <p class="mt-3 text-sm font-semibold leading-6 text-hc-muted">
          {{ helpedCount }} people helped
        </p>

        <button
          class="hc-button mt-6 min-h-14 w-full rounded-[4px] bg-hc-emerald px-6 text-base font-semibold text-white shadow-hc-button transition duration-200 hover:bg-[#0b4333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald sm:w-auto"
          type="button"
          :disabled="isDisabled"
          :aria-busy="isSubmitting"
          @click="markHelped"
        >
          {{ buttonLabel }}
        </button>
        <p v-if="helpedError" class="mt-3 text-sm font-semibold leading-6 text-hc-coral" role="alert">
          {{ helpedError }}
        </p>
      </div>

      <div class="rounded-[4px] border border-hc-line bg-hc-paper-soft p-5">
        <div class="flex items-center justify-center gap-5 text-center">
          <Transition name="hc-count" mode="out-in">
            <p :key="helpedCount" class="text-7xl font-semibold leading-none text-hc-emerald sm:text-8xl">
              {{ helpedCount }}
            </p>
          </Transition>
          <div class="flex flex-col items-center gap-2 text-hc-muted">
            <span class="h-9 w-px bg-hc-line-strong" />
            <svg class="size-5 text-hc-emerald" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 6v20M8 18l8 8 8-8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" />
            </svg>
          </div>
          <p class="max-w-[8rem] text-left text-lg font-semibold leading-6 text-hc-ink">
            people connected to one answer
          </p>
        </div>

        <Transition name="hc-discovery">
          <div v-if="hasJoinedThisSession" class="mt-6 rounded-[4px] bg-hc-emerald p-4 text-white">
            <p class="text-2xl font-semibold leading-tight">
              You just became part of this help's story.
            </p>
            <p class="mt-3 text-sm leading-6 text-white/80">
              {{ helperName }} helped {{ originalRecipient }} once. That same act of kindness helped you too.
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
