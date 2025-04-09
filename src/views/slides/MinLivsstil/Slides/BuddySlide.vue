<script setup lang="ts">
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const props = defineProps<{
  text: string;
  color: 'yellow' | 'blue' | 'green' | 'purple';
}>();
</script>

<template>
  <div class="px-8 w-full h-[548px]">
    <div class="relative h-full pt-5">
      <div class="relative flex top-[-10px] -right-10">
        <speech-bubble :color="color" class="w-[80%] -z-5">
          <div v-html="text" class="pt-10 pl-5 pr-4 pb-4 w-full h-full"></div>
        </speech-bubble>
      </div>
      <img class="monster absolute bottom-6" :src="monsterUrl">
    </div>
  </div>
</template>

<style scoped lang="postcss">
.monster {
  width: 90% !important;
}
</style>
