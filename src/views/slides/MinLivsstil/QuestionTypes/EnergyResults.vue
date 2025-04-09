<script setup lang="ts">
import {useStore} from '@/stores/main';
import type {ProfileValueChange} from '@/types';
import {FmsType} from "@/types";
import {inject} from "vue";

const props = defineProps({
  data: Object,
});

const fmsType: FmsType = inject('fms-type') as  FmsType;

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const store = useStore();
</script>

<template>
  <div class="text-base mb-4" :data-name="data.name">
    <template v-if="fmsType === FmsType.Work">
      <div>Ditt energibehov är {{ Math.ceil(+store.profile.values['foodEnergyNeeds'] ?? 0) }} kcal</div>
      <div>Ditt energiintag är {{ Math.ceil(+store.profile.values['foodEnergyIntake'] ?? 0) }} kcal</div>
      <div class="text-lg font-medium">
        <div v-if="+store.profile.values['foodEnergyBalance'] === 0">Result: Du äter tillräckligt.</div>
        <div v-else>Resultat: Du äter {{ Math.ceil(Math.abs(+store.profile.values['foodEnergyBalance'])) }} kcal för {{ +store.profile.values['foodEnergyBalance'] >= 0 ? 'lite' : 'mycket' }}.</div>
      </div>
    </template>
    <template v-else>
      <div class="text-lg mt-8">
        <div class="font-medium">Resultat:</div>

        <div v-if="+store.profile.values['foodEnergyBalance'] === 0">Du äter tillräckligt.</div>
        <div v-else-if="+store.profile.values['foodEnergyBalance'] <= 0">Du har ett energiöverskott - du äter mer än du gör av med.</div>
        <div v-else>Du har ett energiunderskott - du äter mindre än du behöver.</div>
      </div>
    </template>
  </div>
</template>
