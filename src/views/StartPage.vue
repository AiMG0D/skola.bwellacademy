<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { useIonRouter } from '@ionic/vue';
import logoUrl from '/assets/logo.png';
import monsterUrl from '/assets/monster.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const router = useIonRouter();

function goToLogin() {
  router.replace('/login');
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="px-8 flex flex-col h-full">
        <div class="flex justify-center items-center pt-[5.75rem] pb-4">
          <img :src="logoUrl" class="w-[150px]">
        </div>

        <div class="text-[#171717] flex flex-col w-full relative mb-4">
          <div class="relative flex left-[25px]">
            <span class="absolute w-[235px] text-center font-light text-[25px] top-[60px] left-[16px]">Välkommen!<br>Kul att du ska testa Bwell-metoden.<br>Lycka till!</span>
            <speech-bubble color="purple" width="264" />
          </div>
          <img class="relative self-start w-[240px] mt-[-76px] left-[15px]" :src="monsterUrl">
        </div>

        <b-button @click="goToLogin">Sätt igång</b-button>
      </div>
    </ion-content>
  </ion-page>
</template>
