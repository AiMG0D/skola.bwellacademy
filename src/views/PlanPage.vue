<script setup lang="ts">
import { IonContent, IonFab, IonFabButton, IonLoading, IonSpinner, IonPage, IonIcon, useIonRouter } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import BGoalPlanItem from '@/components/BGoalPlanItem.vue';
import { computed, provide, ref, onMounted } from 'vue';
import { homeSharp } from 'ionicons/icons';
import { useStore } from '@/stores/main';
import type { GoalPlan } from '@/types';

const router = useIonRouter();
const store = useStore();

const loading = ref(false);
const saving = ref(false);
const goals = ref([]);
const savedGoals = ref<Record<number, GoalPlan>>({});

onMounted(async () => {
  loading.value = true;
  goals.value = await store.fetchPlannedGoals();
  loading.value = false;
});

function goHome() {
  router.replace('/evaluate');
}

function planSaved(plan: GoalPlan) {
  savedGoals.value[plan.categoryId] = plan;
}

const canContinue = computed(() => Object.keys(savedGoals.value).length === goals.value.length);

async function save() {
  const plan = Object.values(savedGoals.value).map(({ categoryId, date, factors }) => ({
    categoryId,
    date,
    factors: Object.entries(factors).map(([key, value]) => ({
      categoryId: parseInt(key, 10),
      plan: value.plan,
    })),
  }));

  saving.value = true;
  await store.updatePlannedGoals(plan);
  saving.value = false;

  router.push('/plan/results');
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
      <ion-fab slot="fixed">
        <ion-fab-button @click="goHome">
          <ion-icon :icon="homeSharp" />
        </ion-fab-button>
      </ion-fab>

      <ion-loading :is-open="loading" message="Hämtar mål..." />

      <ion-loading :is-open="saving" message="Sparar plan..." />

      <b-slide-header />

      <div class="px-8 flex flex-col w-full h-[calc(100%-112px)] bg-[#FFFBEE]">
        <div class="overflow-y-auto">
          <h2 class="font-light">Hur ska du nå dina mål?</h2>

          <p v-if="loading" class="flex items-center gap-x-4">
            <ion-spinner />
            <span class="text-yellow-darker font-medium">Laddar mål...</span>
          </p>
          <p v-else-if="goals.length === 0">
            Du har inte valt något att förbättra.
          </p>
          <template v-else>
            <p class="text-base leading-relaxed">Här dina viktigaste mål. Gå till varje och gör fler val.</p>

            <ul class="flex flex-col m-0 p-0 gap-y-2">
              <b-goal-plan-item
                v-for="factor in goals"
                :category-id="factor.category_id"
                :data="factor"
                :vision="factor.vision"
                @saved="planSaved"
              >
                {{ factor.label }}
              </b-goal-plan-item>
            </ul>
          </template>

          <div class="mt-6 mb-12 w-full pt-4 flex justify-center">
            <b-button v-if="canContinue" @click="save">Visa sammanfattning</b-button>
          </div>
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

