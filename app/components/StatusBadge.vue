<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    tone?: 'emerald' | 'coral' | 'amber' | 'ink' | 'light';
    dot?: boolean;
  }>(),
  {
    tone: 'light',
    dot: false,
  },
);

const badgeClass = computed(() => [
  'hc-badge',
  {
    emerald: 'border-hc-emerald/20 bg-hc-emerald-wash text-hc-emerald',
    coral: 'border-hc-coral/20 bg-hc-coral-soft text-hc-coral',
    amber: 'border-hc-amber/25 bg-hc-amber-soft text-hc-ink',
    ink: 'border-hc-ink/10 bg-hc-ink text-white',
    light: 'border-hc-line bg-hc-paper-soft text-hc-muted',
  }[props.tone],
]);

const dotClass = computed(() => ({
  emerald: 'bg-hc-emerald',
  coral: 'bg-hc-coral',
  amber: 'bg-hc-amber',
  ink: 'bg-white',
  light: 'bg-hc-soft',
}[props.tone]));
</script>

<template>
  <span :class="badgeClass">
    <span v-if="dot" class="size-2 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>
