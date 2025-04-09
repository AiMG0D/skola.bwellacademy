<script setup lang="ts">
import { ref } from 'vue';
import { IonModal } from '@ionic/vue';
import type { ProfileValueChange } from '@/types';
import Info from '@/components/icons/Info.vue';
import { useStore } from '@/stores/main';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const store = useStore();

const showHelp = ref(false);
</script>

<template>
  <div class="text-base" :data-name="data.name">
    <p class="m-0">För att veta hur du ska äta ska vi nu beräkna hur många kcal du behöver/ dag – ditt energibehov under en dag. Vi använder två mått: BMR och PAL som multipliceras med varandra.</p>

    <ion-modal :is-open="showHelp" @did-dismiss="showHelp = false">
      <div class="bg-green-background h-full px-8 py-4 font-sans text-base">
        <p class="m-0"><strong>BMR</strong> (Basal Metabolic Rate) är hur mycket energi (hur många kalorier) du skulle behöva om du bara ligger still ett helt dygn, ett minimum av energi som behövs för att din kropp ska fungera. The Harris-Benedict equations revised by Mifflin and St Jeor in 1990.</p>

        <p><strong>PAL</strong> (Physical Activity Level) anger faktorn på din genomsnittliga fysiska aktivitetsnivå under ett dygn.</p>

        <p>PAL är en siffra man får fram som är beräknat på vad du svarat på frågan hur mycket du tränar fysiskt (fråga nr 3)</p>

        <div class="flex justify-center mt-10">
          <b-button @click="showHelp = false">Stäng</b-button>
        </div>
      </div>
    </ion-modal>

    <div class="flex gap-x-2 my-2">
      <button @click="showHelp = true" class="text-left px-4 py-2 mb-4 bg-green-light rounded text-base flex items-center w-full">
        <Info class="text-green-darker shrink-0 mr-2" width="20" />
        <span class="relative top-[1px]">Vad är BMR och PAL?</span>
      </button>
    </div>

    <div>Din vikt är {{ store.profile.values['weight'] ?? '0' }} kg</div>
    <div>Din längd är {{ store.profile.values['length'] ?? '0' }} cm</div>
    <div><strong>Ditt BMR</strong> är {{ store.profile.values['foodBMR'] ?? '0' }} kcal</div>
    <div><strong>Ditt PAL</strong> är {{ store.profile.values['foodPAL'] ?? '0' }}</div>
    <div><strong>Ditt energibehov</strong> är {{ store.profile.values['foodEnergyNeeds'] ?? '0' }} kcal en normal dag</div>
  </div>
</template>

<style lang="postcss" scoped>
table {
  border-collapse:separate;
}
td {
  @apply px-3 py-2.5 border-l border-t border-r-0 border-b-0 border-solid border-[#4C8201];
}
td:last-child {
  @apply border-r;
}
tr:last-child td {
  @apply border-b;
}
</style>
