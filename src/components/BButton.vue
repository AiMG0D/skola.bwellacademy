<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  look: {
    type: String,
    default: 'primary',
  },
  width: {
    type: String,
    default: 'short',
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const classes = computed(() => {
  const base = [
    props.width === 'short' ? '' : 'w-full',
  ];

  if (props.look === 'secondary') {
    return ['bg-primary-lighter', 'border-2', 'border-solid', 'border-purple-darker', 'text-purple-darker'];
  } else {
    return ['bg-primary-dark', 'text-white'];
  }
});
</script>

<template>
  <button type="button" :disabled="disabled" :class="classes" class="button text-lg normal-case font-bold disabled:cursor-not-allowed">
    <slot></slot>
  </button>
</template>

<style scoped lang="postcss">
button {
  padding: 0.625rem 1.375rem;
  border-radius: 1.875rem;
  letter-spacing: -0.01em;
  font-feature-settings: 'calt' off;
}
button[disabled] {
  opacity: 0.35;
  pointer-events: none;
}
</style>
