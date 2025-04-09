<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Chevron from '@/components/icons/Chevron.vue';

const emit = defineEmits<{
  (e: 'toggle', open: boolean): void;
}>();

const element = ref();
const open = ref(false);

function toggle() {
  open.value = element.value.open;
  emit('toggle', element.value.open);
}
</script>

<template>
  <details class="bg-white border shadow-md border-green-light border-solid" ref="element" @toggle="toggle">
    <summary class="text-green-darker font-semibold bg-green-light px-4 py-2 text-base list-none flex justify-between [&::-webkit-details-marker]:hidden cursor-pointer">
      <span class="pointer-events-none"><slot name="summary"></slot></span>

      <Chevron :direction="open ? 'up' : 'down'" />
    </summary>
    <div class="p-4 text-base"><slot></slot></div>
  </details>
</template>

<style scoped lang="postcss">
details {
  border-radius: 8px;
}
details summary {
  border-radius: 8px;
}
details[open] summary {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
