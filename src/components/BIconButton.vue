<script setup lang="ts">
import { computed, inject } from 'vue';

const colorScheme = inject('colorScheme');

const headerColor = computed(() => {
  return {
    purple: 'bg-purple-light',
    yellow: 'bg-yellow-light',
    green: 'bg-green-light',
    blue: 'bg-blue-light',
  }[colorScheme];
});

const iconColor = computed(() => {
  return {
    purple: 'text-purple-dark',
    yellow: 'text-yellow-darker',
    green: 'text-green-dark',
    blue: 'text-blue-dark',
  }[colorScheme];
});
</script>

<template>
  <button type="button" :class="[headerColor, iconColor]" class="button text-lg normal-case font-bold disabled:cursor-not-allowed rounded-full w-12 h-12 shadow-md flex justify-center items-center">
    <slot></slot>
  </button>
</template>

<style scoped lang="postcss">
button {
  letter-spacing: -0.01em;
  font-feature-settings: 'calt' off;
}
</style>
