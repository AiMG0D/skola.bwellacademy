<script setup lang="ts">
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
</script>

<template>
  <div class="px-8 w-full h-[548px]">
    <div class="relative h-full pt-5">
      <div class="relative flex top-[-10px] -right-10">
        <speech-bubble color="purple" class="w-[75%] -z-5">
          <div class="text-[22px] font-light pt-9 pl-3 pr-2 pb-4">
            Bra kämpat!<br><br>Nu tar vi några frågor<br>om hur mycket du rör dig.
          </div>
        </speech-bubble>
      </div>
      <img class="monster shrink-0 absolute bottom-0" :src="monsterUrl">
    </div>
  </div>
</template>
