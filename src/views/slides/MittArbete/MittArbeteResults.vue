<script setup lang="ts">
import PieChart from "@/components/PieChart.vue";
import WorkResult from "@/components/results/WorkResult.vue";
import { computed, inject, ref } from 'vue';
import { useStore } from '@/stores/main';
import { useIonRouter } from '@ionic/vue';

const props = defineProps<{
  questions: any[],
}>();

const store = useStore();
const router = useIonRouter();

const colorScheme = inject('colorScheme', 'yellow');

const previousSlide = inject('previousSlide');
const nextSlide = inject('nextSlide');

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});
</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col text-[#171717]">
    <div class="overflow-y-scroll my-4 scroll-smooth">
      <div class="w-full shrink-0">
        <h2 class="font-light mb-0 px-8">Bra jobbat, se resultatet!</h2>

        <div class="text-sm text-black/60 px-8 mt-4">Klicka på en tårtbit för att se mer information om ditt resultat.</div>
      </div>

      <div class="px-8">
        <WorkResult :factors="store.profile?.factors" :questions="questions" />
      </div>
    </div>

    <div class="mt-auto px-8 pt-10 pb-8 button-border relative">
      <div class="grid grid-cols-2 gap-4">
        <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
        <b-button @click="nextSlide">Nästa</b-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.button-border {
  box-shadow: 0px -0.5px 2px 0px rgba(0, 0, 0, 0.25);
}
</style>
