<script setup lang="ts">
import ImageViewer from "@/components/ImageViewer.vue";
import {modalController} from "@ionic/vue";
import { computed, inject } from 'vue';
import BRadioItem from '@/components/BRadioItem.vue';
import colors from '@/colors.json';
import Info from '@/components/icons/Info.vue';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const colorScheme = inject('colorScheme', 'green');
const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme];
});

const radioColor = computed(() => {
  return {
    purple: colors.purple.darker,
    yellow: colors.yellow.darker,
    green: colors.green.darker,
    blue: colors.blue.darker,
  }[colorScheme];
});

async function showPoster(poster: string) {
  const modal = await modalController.create({
    component: ImageViewer,
    componentProps: {
      poster
    }
  });

  await modal.present();

  await modal.onWillDismiss();
}
</script>

<template>
  <div class="mb-6" :data-name="data.name">
    <p class="w-full mt-0 text-base" v-html="data.description"></p>

    <div v-if="data.poster.url !== null" class="mb-4">
      <a @click.prevent="showPoster(data.poster.url)" href="#" target="_blank" class="flex items-center gap-x-1 no-underline text-black">
        <Info class="text-green-darker" width="20" />
        <span class="text-base leading-none relative top-[1px]">Tryck här för att se {{ data.poster.text }}</span>
      </a>
    </div>

    <ul class="flex flex-col my-0 p-0 gap-y-2">
      <b-radio-item
        class="text-base"
        :color-scheme="colorScheme"
        :name="data.name"
        :data="answer"
        :index="idx"
        v-for="(answer, idx) in data.data"
        @picked="$emit('change', { name: data.name, value: answer.value })"
      />
    </ul>
  </div>
</template>
