<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  color: String,
  disabled: Boolean,
  number: Number,
});

const backgroundColor = computed(() => {
  const colors = {
    yellow: 'bg-yellow-light',
    green: 'bg-green-light',
    blue: 'bg-blue-light',
    purple: 'bg-purple-light',
  };

  return colors[props.color];
});

const textColor = computed(() => {
  const colors = {
    yellow: 'text-yellow-darker',
    green: 'text-green-darker',
    blue: 'text-blue-darker',
    purple: 'text-purple-darker',
  };

  return colors[props.color];
});
</script>

<template>
  <button
    :class="['w-[148px]', 'h-[125px]', 'rounded-md', 'relative', 'shadow-lg', backgroundColor]"
    :data-disabled="disabled"
  >
    <span class="text-[40px] font-black text-white absolute top-0 left-0 ml-3 mt-3">
      {{ number }}.
    </span>

    <div class="flex flex-col justify-between items-center h-full pb-[12px]">
      <slot name="icon">
        ikon
      </slot>

      <span :class="[textColor, 'font-bold', 'text-lg', 'leading-5']"><slot></slot></span>
    </div>
  </button>
</template>

<style scoped>
button > * {
  pointer-events: none;
}
button[data-disabled='true'] {
  opacity: 0.50;
}
</style>
