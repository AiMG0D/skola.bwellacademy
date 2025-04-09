<script setup lang="ts">
import { computed, inject } from 'vue';
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const colorScheme = inject('colorScheme', 'yellow');

const goToNextPage = inject('goToNextPage');
const nextSlide = inject('nextSlide');
const previousSlide = inject('previousSlide');

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
  <div :class="backgroundColor" class="w-full h-full flex flex-col overflow-y-auto">
    <div class="text-[#171717] flex flex-col w-full relative">
      <div class="relative flex top-[25px] left-[25px]">
        <speech-bubble :color="colorScheme">
          <div class="text-[21px] pt-6 px-6">
            Bra!<br><br>Nu tar vi några enkla fystester och frågor om din livsstil.
          </div>
        </speech-bubble>
      </div>

      <img class="relative self-end right-[35px]" :src="monsterUrl">
    </div>

    <div class="mt-auto px-8 mb-12 grid grid-cols-2 gap-4">
      <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
      <b-button @click="goToNextPage">Nästa</b-button>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 324px !important;
}
</style>
