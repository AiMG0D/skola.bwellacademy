<script setup lang="ts">
import BButton from "@/components/BButton.vue";
import BwellFeedbackModal from "@/views/BwellFeedbackModal.vue";
import { IonContent, IonFab, IonLoading, IonSpinner, IonPage, useIonRouter, loadingController, modalController } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import BPlanItem from '@/components/BPlanItem.vue';
import {provide, ref, onMounted, computed} from 'vue';
import { useStore } from '@/stores/main';
import Star from '@/components/icons/Star.vue';
import monsterUrl from '/assets/monster.png';
import SpeechBubble from '@/components/SpeechBubble.vue';

const router = useIonRouter();
const store = useStore();

const loading = ref(false);
const plan = ref(null);
const goals = computed(() => {
  return plan.value?.goals || [];
})

onMounted(async () => {
  loading.value = true;
  plan.value = await store.fetchPlan();
  loading.value = false;
});

async function openOneLastThingModal() {
  const loadingQuestions = await loadingController.create({
    message: 'Vänta...'
  });

  await loadingQuestions.present();

  await store.fetchFeedbackQuestions();

  await loadingQuestions.dismiss();

  const loading = await loadingController.create({
    message: 'Avslutar...'
  });

  if (store.feedbackQuestions && store.feedbackQuestions.length) {
    const modal = await modalController.create({
      component: BwellFeedbackModal,
      backdropDismiss: false,
    });

    await modal.present();

    const result = await modal.onWillDismiss();

    await loading.present();

    await store.saveFeedback(result.data);
  } else {
    await loading.present();
  }

  await store.finishPlan();

  await loading.dismiss();

  router.replace('/home');
}

provide('pageData', {
  number: 4,
  title: 'Min livsstilsplan',
  icon: null,
});
provide('colorScheme', 'yellow');
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-loading :is-open="loading" message="Hämtar plan..." />

      <b-slide-header />

      <div
        class="flex justify-center items-center -mt-3 pb-8 text-sm tracking-[0.5rem] font-medium uppercase text-purple-darker relative bg-yellow-light"
      >
        <star class="mr-4" />
        <span class="relative top-[1px]">Sammanfattning</span>
        <star class="ml-2" />
      </div>

      <div class="px-8 pt-8 flex flex-col w-full h-[calc(100%-112px)] bg-[#FFFBEE] overflow-x-hidden overflow-y-auto">
        <div class="pb-8">
          <p v-if="loading" class="flex items-center gap-x-4">
            <ion-spinner />
            <span class="text-yellow-darker font-medium">Laddar mål...</span>
          </p>
          <template v-else>
            <ul class="flex flex-col m-0 p-0 gap-y-2">
              <b-plan-item v-for="goal in goals" :data="goal">
                {{ goal.label }}
              </b-plan-item>
            </ul>
          </template>
        </div>

        <div class="flex items-end">
          <img class="monster w-[35%]" :src="monsterUrl">

          <div class="relative">
            <speech-bubble color="yellow" class="w-[100%] -z-5 rotate-[130deg]">
            </speech-bubble>
            <div class="absolute inset-0 pl-[20%] pr-[10%] pt-6 flex items-center justify-center text-center text-[min(4.5vw,19px)]">
              Äntligen klar!<br>
              Vi ses igen när det är dags att uppdatera din Livsstilsplan.<br>
              Lycka till!
            </div>
          </div>
        </div>

        <div class="pt-12 pb-8 text-center">
          <b-button @click="openOneLastThingModal">Avsluta denna livsstilsplan</b-button>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-fab {
  right: 0.5rem;
  top: 130px;
}
ion-content {
  --keyboard-offset: 0 !important;
}
</style>

