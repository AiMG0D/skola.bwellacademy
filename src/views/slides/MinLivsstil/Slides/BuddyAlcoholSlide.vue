<script setup lang="ts">
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
import {FmsType} from "@/types";
import {inject} from "vue";

const fmsType: FmsType = inject('fms-type') as FmsType;
</script>

<template>
  <div class="px-8 w-full h-[548px]">
    <div class="relative h-full pt-5">
      <div class="relative flex top-[-10px] -right-10">
        <speech-bubble color="green" class="w-[80%] -z-5">
          <div class="pt-10 pl-5 pr-4 pb-4 w-full h-full">
            <div v-if="fmsType === FmsType.Work" class="pt-4">
              <strong>Risk- eller friskvärde<br>på alkohol?</strong><br>
              Vi utgår bara från Folkhälsomyndighetens gränsvärden!
            </div>
            <div v-else class="pt-4">
              Hjärnan är inte fullt utvecklad förrän i 25-årsåldern och påverkas negativt av alkohol.
            </div>
          </div>
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
