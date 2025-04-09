<script setup lang="ts">
import {useStore} from "@/stores/main";
import { IonContent, IonFab, IonFabButton, IonPage, IonIcon, useIonRouter } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import { provide } from 'vue';
import { homeSharp } from 'ionicons/icons';
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const store = useStore();
const router = useIonRouter();

function goHome() {
  router.replace('/evaluate');
}

async function next() {
  if(hasNotCompletedPhysicalTests()) {
    router.replace('/goals/reminder');
    return;
  }

  router.replace('/goals/happy');
}

function hasNotCompletedPhysicalTests()
{
  return !store.profile.factors[13]?.value ?? false;
}

const colorScheme = 'blue';

provide('pageData', {
  number: 3,
  title: 'Mina mål',
  icon: null,
});
provide('colorScheme', colorScheme);
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" class="overflow-hidden">
      <ion-fab slot="fixed">
        <ion-fab-button @click="goHome">
          <ion-icon :icon="homeSharp" />
        </ion-fab-button>
      </ion-fab>

      <b-slide-header />

      <div class="px-8 w-full aspect-[1/1.5]">
        <div class="relative h-full pt-5">
          <div class="relative flex top-[-10px] -right-10">
            <speech-bubble :color="colorScheme" class="w-[80%] -z-5">
              <div class="text-[20px] pt-10 pl-5 pr-4 pb-4 w-full h-full">
                Då vet du utgångsläget.<br>Nu ska du sätta upp några <strong>MÅL</strong> framåt.<br><strong>VAD VILL DU UPPNÅ?</strong>
              </div>
            </speech-bubble>
          </div>
          <img class="monster absolute bottom-6" :src="monsterUrl">
        </div>

        <div class="mt-auto pt-4 pb-12 grid grid-cols-1 gap-4 z-10">
          <b-button @click="next">Nästa</b-button>
        </div>
      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-fab {
  right: 0.5rem;
  top: 90px;
}
ion-content {
  --keyboard-offset: 0 !important;
}
</style>
