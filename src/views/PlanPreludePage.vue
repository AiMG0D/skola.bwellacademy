<script setup lang="ts">
import { IonContent, IonFab, IonFabButton, IonLoading, IonSpinner, IonPage, IonIcon, useIonRouter } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import { computed, provide, ref, onMounted } from 'vue';
import { homeSharp } from 'ionicons/icons';
import { useStore } from '@/stores/main';
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const router = useIonRouter();

function goHome() {
  router.replace('/evaluate');
}

function goBack() {
  router.back();
}

async function next() {
  router.push('/plan');
}

const colorScheme = 'yellow';

provide('pageData', {
  number: 4,
  title: 'Min livsstilsplan',
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

      <div class="px-8 flex flex-col w-full h-[calc(100%-112px)] bg-[#FFFBEE] overflow-hidden">
        <div class="flex flex-col flex-shrink overflow-y-auto overflow-x-hidden">
          <div class="flex flex-col flex-shrink min-h-0">
            <div class="flex-shrink-0 relative top-[25px] left-[5px]">
              <speech-bubble :color="colorScheme" class="w-[65%] -z-5">
                <div class="text-[22px] pt-11 pl-5 pr-4 pb-4">
                  Inte långt kvar nu.<br>
                  Nu är det dags att bestämma vad du ska göra för att nå dina mål.
                </div>
              </speech-bubble>
            </div>

            <img class="monster self-center h-full min-h-16 flex-shrink" :src="monsterUrl">
          </div>
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
