<script setup lang="ts">
import BPlanItem from "@/components/BPlanItem.vue";
import LifestyleResult from "@/components/results/LifestyleResult.vue";
import WorkResult from "@/components/results/WorkResult.vue";
import {FmsType} from "@/types";
import {IonButton, IonButtons, IonContent, IonIcon, IonTitle, IonToolbar, modalController} from '@ionic/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import {closeOutline, warningOutline} from "ionicons/icons";
import {inject} from "vue";

const props = defineProps<{
  profile: {
    id: number;
    created_at: string;
  };
  plan: any;
}>();

const fmsType: FmsType = inject('fms-type') as FmsType;

function close() {
  modalController.dismiss();
}
</script>

<template>
  <ion-content class="ion-padding">
    <ion-toolbar>
      <ion-title>
        <div>Livsstilsplan</div>
        <div class="text-sm">{{ dayjs(profile.created_at).locale('sv').format('D MMMM, YYYY') }}</div>
      </ion-title>

      <ion-buttons slot="end" class="-mt-2">
        <ion-button @click="close">
          <ion-icon :icon="closeOutline" slot="icon-only" class="text-yellow-darker" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <div class="absolute top-16 bottom-0 inset-x-0 overflow-x-hidden overflow-y-auto bg-[#FFFBEE]">
      <div class="px-8 py-8 flex flex-col w-full">

        <div v-if="plan.goals && plan.goals.length > 0 && plan.goals[0].texts?.length > 0" class="mb-8 p-6 rounded-xl bg-purple-dark text-white flex items-center space-x-4">
          <ion-icon :icon="warningOutline" class="text-3xl"/>
          <p class="flex-1 m-0 text-base leading-normal">Detta är en gammal livsstilsplan! Innehållet nedan kan därför se lite konstigt ut.</p>
        </div>

        <template v-if="fmsType === FmsType.School">
          <h2 class="m-0 mb-8 font-normal text-yellow-darker">Min skolgång</h2>

          <WorkResult :questions="plan.questions.school.groups[0].questions" :factors="plan.profile.factors" />
        </template>
        <template v-else>
          <h2 class="m-0 mb-8 font-normal text-yellow-darker">Mitt arbete</h2>

          <WorkResult :questions="plan.questions.work.groups[0].questions" :factors="plan.profile.factors" />
        </template>

        <h2 class="m-0 mb-8 font-normal text-yellow-darker">Min livsstil</h2>

        <LifestyleResult :sections="plan.questions.life.sections" :factors="plan.profile.factors" />

        <h2 class="m-0 mt-8 mb-8 font-normal text-yellow-darker">Dina mål</h2>

        <ul v-if="plan.goals.length" class="flex flex-col m-0 p-0 gap-y-4">
          <b-plan-item v-for="goal in plan.goals" :data="goal">
            {{ goal.label }}
          </b-plan-item>
        </ul>
        <div v-else>
          Du har inte valt något att förbättra.
        </div>
      </div>
    </div>

  </ion-content>
</template>

<style scoped lang="postcss">
ion-content {
  --background: theme('colors.yellow.light');
}
ion-toolbar {
  --background: theme('colors.yellow.light');
  --color: theme('colors.yellow.darker');
  --min-height: 64px;
}
ion-title {
  font-size: 20px;
}
</style>
