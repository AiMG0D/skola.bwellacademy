<script setup lang="ts">
import { IonContent, IonFab, IonFabButton, IonLoading, IonSpinner, IonPage, IonIcon, useIonRouter } from '@ionic/vue';
import BSlideHeader from '@/components/BSlideHeader.vue';
import { computed, provide, ref, onMounted } from 'vue';
import { homeSharp } from 'ionicons/icons';
import { useStore } from '@/stores/main';

const router = useIonRouter();
const store = useStore();

const satisfactions = ref([]);
const loading = ref(false);
const saving = ref(false);
const selected = ref([]);

onMounted(async () => {
  loading.value = true;
  satisfactions.value = await store.fetchSatisfaction();
  loading.value = false;

  selected.value = satisfactions.value.filter((f) => f.selected === 1).map((factor) => factor.category_id);
});

function toggleSelection(event) {
  const value = parseInt(event.target.value, 10);

  if (selected.value.includes(value)) {
    selected.value = selected.value.filter((v) => v !== value);
  } else {
    if (selected.value.length < 3) {
      selected.value.push(value);
    } else {
      event.target.checked = false;
    }
  }
}

function goHome() {
  router.replace('/evaluate');
}

async function save() {
  saving.value = true;
  await store.updateSatisfaction(selected.value);
  saving.value = false;

  router.push('/goals/reflect');
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
          <h2 class="font-light">Här ser du en lista med allt det du sagt att du är nöjd med.</h2>

          <p v-if="loading" class="flex items-center gap-x-4">
            <ion-spinner />
            <span class="text-blue-darker font-medium">Laddar mål...</span>
          </p>
          <p v-else-if="satisfactions.length === 0">
            Du har inte valt något som du är nöjd med.
          </p>
          <template v-else>
            <p class="text-base">Klicka på de tre du är allra mest nöjd med.</p>

            <ul class="flex flex-col m-0 p-0 gap-y-2">
              <li v-for="factor in satisfactions" class="block">
                <b-checkbox-item
                  :id="factor.category_id"
                  @change="toggleSelection"
                  :value="factor.category_id"
                  :checked="factor.selected"
                >
                    {{ factor.label }}
                </b-checkbox-item>
              </li>
            </ul>

            <p class="text-sm">Om du vill ändra, klicka på den du vill välja bort och välj en ny.</p>
          </template>
        </div>

        <div class="mt-auto pt-4 mb-12 grid grid-cols-1 gap-4">
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
