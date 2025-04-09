<script setup lang="ts">
import {useStore} from '@/stores/main';
import {FmsType} from "@/types";
import {computed, inject} from 'vue';

const categoryId = 97;

const store = useStore();
const fmsType: FmsType = inject('fms-type') as FmsType;

const questionsAnswered = computed(() => {
  return store.getProfileValue('energy') !== null &&
    store.getProfileValue('training') !== null &&
    store.getProfileValue('sitting') !== null;
});

const factor = computed(() => store.profile.factors?.[categoryId]);

async function handleImprove(value: string) {
  await store.setImproveValue(categoryId, value);
}

const colorScheme = inject('colorScheme', 'green');
const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme] ?? 'border-green-light';
});

const improve = computed(() => {
  return factor.value?.improve || null;
});
</script>

<template>
  <div class="px-8 pt-6 gap-y-4 w-full">
    <div class="flex items-center gap-x-4 mt-2 mb-1">
      <h3 class="m-0 font-light">Resultat Fysisk Aktivitet</h3>
    </div>

    <div v-if="!questionsAnswered" class="mt-4 text-base">Du har inte svarat på de andra frågorna.</div>

    <p v-else-if="fmsType === FmsType.Work" class="w-full mt-0 text-base">Medelvärde av fysiska aktivitet och stillasittande.</p>
    <p v-else class="w-full mt-0 text-base">Medelvärde av vardagsaktiviteter, stillasittande och fysisk träning.</p>

    <div v-if="questionsAnswered" :class="borderColor" class="border-t border-0 border-solid py-4 text-base">
      <div>Du har {{ factor?.label }}värde.</div>

      <ul class="flex flex-col m-0 mt-4 p-0">
        <li class="list-none">
          <b-radio
            :name="`physicalActivity-improve`"
            :color="colorScheme"
            value="1"
            label="Detta är jag nöjd med"
            :label-id="`physicalActivity-improve-1-label`"
            @change="handleImprove('1')"
            v-model="improve"
          />
        </li>

        <li class="list-none">
          <b-radio
            :name="`physicalActivity-improve`"
            :color="colorScheme"
            value="2"
            label="Detta vill jag förbättra"
            :label-id="`physicalActivity-improve-2-label`"
            @change="handleImprove('2')"
            v-model="improve"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
