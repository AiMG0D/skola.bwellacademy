<script setup lang="ts">
import { IonContent, IonFab, IonFabButton, IonLoading, IonSpinner, IonPage, IonIcon, useIonRouter } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import BGoalItem from '@/components/BGoalItem.vue';
import { computed, provide, ref, onMounted } from 'vue';
import { homeSharp } from 'ionicons/icons';
import { useStore } from '@/stores/main';

const router = useIonRouter();
const store = useStore();

const loading = ref(false);
const saving = ref(false);
const selected = ref([]);
const goals = ref([]);
const visions = ref({});

onMounted(async () => {
  loading.value = true;
  goals.value = await store.fetchGoals();
  loading.value = false;

  const filteredGoals = goals.value.filter((f) => f.selected === 1);
  selected.value = filteredGoals.map((factor) => factor.category_id);
  for (const goal of filteredGoals) {
    visions.value[goal.category_id] = goal.vision;
  }
});

function toggleSelection(event) {
  const value = parseInt(event.target.value, 10);

  if (selected.value.includes(value)) {
    selected.value = selected.value.filter((v) => v !== value);
  } else {
    if (selected.value.length < 3) {
      selected.value.push(value);
    }
  }
}

function updateVision({ id: categoryId, vision }) {
  visions.value[categoryId] = vision;
}

function goHome() {
  router.replace('/evaluate');
}

async function save() {
  const newGoals = selected.value.map((category) => ({
    category_id: category,
    vision: visions.value[category],
  }));

  saving.value = true;
  await store.updateGoals(newGoals);
  saving.value = false;

  router.push('/plan/prelude');
}

function goBack() {
  router.back();
}

provide('pageData', {
  number: 3,
  title: 'Mina mål',
  icon: null,
});
provide('colorScheme', 'blue');
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-fab slot="fixed">
        <ion-fab-button @click="goHome">
          <ion-icon :icon="homeSharp" />
        </ion-fab-button>
      </ion-fab>

      <ion-loading :is-open="loading" message="Hämtar värden..." />

      <ion-loading :is-open="saving" message="Sparar mål..." />

      <b-slide-header />

      <div class="px-8 flex flex-col w-full h-[calc(100%-112px)] bg-[#F3FFFE]">
        <div class="overflow-y-auto">
          <h2 class="font-light">Det här har du sagt att du vill förbättra.</h2>

          <p v-if="loading" class="flex items-center gap-x-4">
            <ion-spinner />
            <span class="text-blue-darker font-medium">Laddar mål...</span>
          </p>
          <p v-else-if="goals.length === 0">
            Du har inte valt något att förbättra.
          </p>
          <template v-else>
            <p class="text-base">Välj nu ut de förbättringar (max 3) som du tror är viktigast för dig att uppnå. Det är dina Livsstilsmål.</p>

            <ul class="flex flex-col m-0 p-0 gap-y-2">
              <b-goal-item
                v-for="factor in goals"
                :id="factor.category_id"
                @change="toggleSelection"
                :value="factor.category_id"
                :checked="factor.selected"
                :vision="factor.vision"
                :current="factor.value"
                :prevent-updates="selected.length >= 3"
                @vision-updated="updateVision"
              >
                {{ factor.label }}
              </b-goal-item>
            </ul>

            <p class="text-sm">Om du vill ändra, klicka på den du vill välja bort och välj en ny.</p>
          </template>
        </div>

        <div class="mt-auto pt-4 mb-12 grid grid-cols-2 gap-4">
          <b-button @click="goBack" look="secondary">Tillbaka</b-button>
          <b-button @click="save">Nästa</b-button>
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
