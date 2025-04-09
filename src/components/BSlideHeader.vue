<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import BProgressBar from '@/components/BProgressBar.vue';

const props = defineProps({
  progressBar: {
    type: Boolean,
    default: true,
  },
  currentSlideIdx: Number,
  questionCount: Number,
});

const pageData = inject('pageData');
const colorScheme = inject('colorScheme', 'yellow');

const headerColor = computed(() => {
  return {
    purple: 'bg-purple-light',
    yellow: 'bg-yellow-light',
    green: 'bg-green-light',
    blue: 'bg-blue-light',
  }[colorScheme];
});

const textColor = computed(() => {
  return {
    purple: 'text-purple-darker',
    yellow: 'text-yellow-darker',
    green: 'text-green-darker',
    blue: 'text-blue-darker',
  }[colorScheme];
});

const headerHeight = computed(() => {
  return props.currentSlideIdx > 0 ? 'h-[156px]' : 'h-[112px]';
});

const classes = computed(() => {
  return [
    'grid',
    'grid-rows-1',
    'grid-cols-3',
    'items-center',
    'h-[112px]',
  ];
});
</script>

<template>
  <div :class="[headerHeight, headerColor, 'transition-[height]']">
    <div :class="classes">
      <span class="text-4xl text-white font-black place-self-start pl-6 pt-8">{{ pageData.number }}.</span>
      <h1 :class="['m-0', textColor, 'text-[20px]', 'text-center']" v-text="pageData.title"></h1>
      <component :is="pageData.icon"></component>
    </div>
    <div class="px-8" v-show="currentSlideIdx > 0 && currentSlideIdx <= questionCount">
      <b-progress-bar :current="currentSlideIdx || 0" :max="questionCount || 0" />
    </div>
  </div>
</template>
