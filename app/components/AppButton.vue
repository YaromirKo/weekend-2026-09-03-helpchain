<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();

const props = withDefaults(
  defineProps<{
    to?: string;
    variant?: 'primary' | 'secondary' | 'ink' | 'amber' | 'light' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    block?: boolean;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    ariaBusy?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    type: 'button',
    disabled: false,
    ariaBusy: false,
  },
);

const buttonClass = computed(() => [
  'hc-button rounded-[4px]',
  props.block ? 'w-full' : '',
  {
    sm: 'min-h-10 px-4 text-xs',
    md: 'min-h-12 px-5 text-sm',
    lg: 'min-h-14 px-6 text-base',
  }[props.size],
  {
    primary: 'hc-button-primary',
    secondary: 'hc-button-secondary',
    ink: 'bg-hc-ink text-white shadow-[0_18px_40px_rgba(20,31,27,0.18)] hover:bg-[#0d1713]',
    amber: 'bg-hc-amber text-hc-ink shadow-[0_12px_28px_rgba(196,132,37,0.22)] hover:bg-[#dea348]',
    light: 'bg-hc-paper text-hc-emerald shadow-hc-soft hover:bg-white',
    ghost: 'bg-transparent text-hc-muted hover:bg-hc-paper-soft hover:text-hc-ink',
  }[props.variant],
]);
</script>

<template>
  <NuxtLink v-if="to" v-bind="attrs" :to="to" :class="[buttonClass, attrs.class]">
    <slot />
  </NuxtLink>

  <button
    v-else
    v-bind="attrs"
    :type="type"
    :disabled="disabled"
    :aria-busy="ariaBusy"
    :class="[buttonClass, attrs.class]"
  >
    <slot />
  </button>
</template>
