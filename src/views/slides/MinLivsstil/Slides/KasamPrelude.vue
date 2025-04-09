<script setup lang="ts">
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
</script>

<template>
  <div class="w-full h-[480px]">
    <div class="relative h-full pt-5">
      <div class="relative flex top-[-10px] left-2">
        <speech-bubble color="green" class="w-[58%] -z-5">
          <div class="pt-9 pl-6 pr-4 pb-4">
            Nu ett test som visar<br>om livet känns<br>begripligt, hanterbart<br>och meningsfullt.<br>Frivilligt att svara på - <strong>om</strong> din arbetsgivare sagt det!
          </div>
        </speech-bubble>
      </div>

      <img class="monster shrink-0 absolute bottom-0 right-0" :src="monsterUrl">
    </div>
  </div>
</template>

<style scoped lang="postcss">
.monster {
  width: 80% !important;
}
</style>

