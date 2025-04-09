<script setup lang="ts">
import {FmsType} from "@/types";
import { computed, inject, ref } from 'vue';
import { useStore } from '@/stores/main';
import BProgressBar from '@/components/BProgressBar.vue';
import BSubpageIcon from '@/components/BSubpageIcon.vue';
import Star from '@/components/icons/Star.vue';

const props = defineProps({
  currentSlideIdx: Number,
  questionCount: Number,
  showProgress: Boolean,
  isResultsPage: Boolean,
});

const emit = defineEmits<{
  (e: 'slide', value: number): void;
}>();

const pageData = inject('pageData');
const colorScheme = inject('colorScheme', 'yellow');

const store = useStore();

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

const headerHeight = computed(() => props.currentSlideIdx > 0 ? 'h-[156px]' : 'h-[112px]');

function onBarSlide(e: any) {
  emit('slide', e);
}
</script>

<template>
  <div :class="[headerHeight, headerColor, 'transition-[height]']">
    <div class="grid grid-rows-1 grid-cols-[1fr_3fr_1fr] items-center h-[112px]">
      <span class="text-4xl text-white font-black place-self-start pl-6 pt-8">{{ pageData.number }}.</span>

      <div :class="[textColor, 'text-center']">
        <h1 class="m-0 text-[20px]" v-text="pageData.title"></h1>
      </div>

      <component :is="pageData.icon" />
    </div>

    <div class="px-8" v-if="currentSlideIdx > 0 && showProgress">
      <b-progress-bar :current="currentSlideIdx" :max="questionCount" @slide="onBarSlide" interactive />
    </div>

    <div
      v-if="isResultsPage"
      class="flex justify-center items-center text-sm tracking-[0.5rem] font-medium uppercase text-purple-darker relative"
    >
      <star class="mr-4" />
      <span class="relative top-[1px]">Resultat</span>
      <star class="ml-2" />
    </div>
  </div>
</template>
