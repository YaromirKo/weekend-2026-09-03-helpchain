<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  initialCount: number;
  helperName: string;
  originalRecipient: string;
}>();

const emit = defineEmits<{
  helped: [joined: boolean];
}>();

const hasJoined = ref(false);
const helpedCount = computed(() => props.initialCount + (hasJoined.value ? 1 : 0));

const markHelped = () => {
  if (hasJoined.value) {
    return;
  }

  hasJoined.value = true;
  emit('helped', true);
};
</script>

<template>
  <section class="rounded-[8px] border border-hc-line bg-hc-paper p-5 shadow-hc-card sm:p-7">
    <div class="grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
      <div>
        <h2 class="text-3xl font-semibold leading-tight text-hc-ink">
          Did this solve your problem?
        </h2>
        <p class="mt-3 text-sm font-semibold leading-6 text-hc-muted">
          {{ helpedCount }} people helped
        </p>

        <button
          class="hc-button mt-6 min-h-14 w-full rounded-[8px] bg-hc-emerald px-6 text-base font-semibold text-white shadow-hc-button transition duration-200 hover:bg-[#0b4333] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hc-emerald sm:w-auto"
          type="button"
          :disabled="hasJoined"
          @click="markHelped"
        >
          This helped me
        </button>
      </div>

      <div class="rounded-[8px] border border-hc-line bg-hc-paper-soft p-5">
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
          <div v-if="hasJoined" class="mt-6 rounded-[8px] bg-hc-emerald p-4 text-white">
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
