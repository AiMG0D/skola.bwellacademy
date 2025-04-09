<script setup lang="ts">
import BSubpageIcon from '@/components/BSubpageIcon.vue';
import {useStore} from "@/stores/main";
import {computed, inject, onMounted} from 'vue';
import { IonSpinner } from '@ionic/vue';

const props = defineProps<{
  sections: any[],
}>();

const store = useStore();

const colorScheme = inject('colorScheme', 'green');
const nextSlide = inject('nextSlide');

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

onMounted(() => {
  if (store.savePoints?.life?.page !== null) {
    setTimeout(() => {
      nextSlide();
    }, 1);
  }
})
</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col overflow-y-auto">
    <div class="px-8 text-[#171717]">
      <h2 class="font-light text-[25px] my-8">Levnadsvanor</h2>
      <p class="text-lg my-2">Här ser du vad det handlar om.</p>
    </div>

    <div v-if="sections.length === 0" class="flex items-center gap-x-4 px-8">
      <ion-spinner />
      <span class="text-green-darker font-medium">Laddar områden...</span>
    </div>

    <ul v-else class="flex flex-col gap-y-2 text-base text-green-darker font-medium pl-[1.75rem]">
      <li v-for="section in sections" class="flex items-center gap-x-4">
        <b-subpage-icon :icon="section.pageName" />
        <span v-html="section.pageLabel"></span>
      </li>
    </ul>

    <p class="text-base px-8">Du kan hoppa mellan de olika delarna när du klickat på START.</p>

    <div>
      <div class="flex flex-col justify-end px-8 h-full">
        <b-button class="mb-12" @click="nextSlide">Starta!</b-button>
      </div>
    </div>
  </div>
</template>
