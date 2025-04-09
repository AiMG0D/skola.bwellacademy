<script setup lang="ts">
import BJointRadioItem from "@/components/BJointRadioItem.vue";
import BSelect from "@/components/BSelect.vue";
import Info from "@/components/icons/Info.vue";
import { useStore } from '@/stores/main';
import {ProfileValueChange} from "@/types";
import {useDebounceFn} from "@vueuse/core";
import {computed, inject, ref, watch} from 'vue';

const categoryId = 4;

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const store = useStore();

const factor = computed(() => store.profile.factors?.[categoryId]);
const showImprove = computed(() => factor.value?.risk_value !== null);
const fitMethod = computed(() => {
  let value = store.profile.values?.fitMethod;

  if (value === undefined) {
    value = null;
  }

  return value;
});

async function onChange(e: {name: string, value: string}) {
  const result = await store.setProfileValue(e.name, e.value);

  emit('update');
}

async function handleImprove(value: string) {
  await store.setImproveValue(categoryId, value);
}

const onInputChange = useDebounceFn((name: string, event: InputEvent) => {
  const value = (event.target as HTMLInputElement)?.value ?? '';
  onChange({name, value});
}, 750);

const onSelectChange = useDebounceFn((name: string, value: any) => {
  onChange({name, value: value ?? ''});
}, 300);

const parentScroll = inject('shouldScroll');
watch(showImprove, () => {
  if (showImprove.value) {
    setTimeout(() => {
      parentScroll.scrollDown();
    }, 100);
  }
});

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
      <h3 class="m-0 font-light">Kondition</h3>
    </div>

    <p class="text-base mb-1">Maxtest</p>

    <ul class="p-0 m-0 bg-white rounded border-green-light border-solid border divide-y divide-green-light divide-solid divide-x-0">
      <b-joint-radio-item
        color="green"
        name="fitMethod"
        :data="{label: 'Coopertest', value: 7}"
        @picked="onChange({ name: 'fitMethod', value: '7' })"
        :vertical="false"
      />
      <b-joint-radio-item
        color="green"
        name="fitMethod"
        :data="{label: 'Beeptest', value: 6}"
        @picked="onChange({ name: 'fitMethod', value: '6' })"
        :vertical="false"
      />
    </ul>

    <p class="text-base mb-1">Submaxtest</p>

    <ul class="p-0 m-0 bg-white rounded border-green-light border-solid border divide-y divide-green-light divide-solid divide-x-0">
      <b-joint-radio-item
        color="green"
        name="fitMethod"
        :data="{label: 'Steptest', value: 0}"
        @picked="onChange({ name: 'fitMethod', value: '0' })"
        :vertical="false"
      />
      <b-joint-radio-item
        color="green"
        name="fitMethod"
        :data="{label: 'Ergometercykel', value: 1}"
        @picked="onChange({ name: 'fitMethod', value: '1' })"
        :vertical="false"
      />
      <b-joint-radio-item
        color="green"
        name="fitMethod"
        :data="{label: '1-Mile walk test', value: 5}"
        @picked="onChange({ name: 'fitMethod', value: '5' })"
        :vertical="false"
      />
    </ul>

    <div v-if="fitMethod !== undefined && fitMethod !== null" class="mt-8 pb-8">
      <template v-if="+fitMethod === 7">
        <h3 class="font-light mt-0">Coopertest</h3>

        <p class="text-base">Fyll i antal meter du sprungit på 12 minuter</p>

        <div class="flex text-sm gap-x-1 mb-4 items-start">
          <Info class="text-green-darker shrink-0" width="20" />
          Förslag – ladda ner Runkeeper på din mobil
        </div>

        <div class="flex mb-6 items-center">
          <b-input
            @input="onInputChange('fitCooperDistance', $event)"
            v-model="store.profile.values['fitCooperDistance']"
          />
          <span class="ml-2 w-8">m</span>
        </div>
      </template>

      <template v-else-if="+fitMethod === 6">
        <h3 class="font-light mt-0">Beeptest</h3>

        <div class="space-y-2">
          <div class="flex items-center space-x-4">
            <span class="block w-44 flex-none">Level</span>
            <b-input @input="onInputChange('fitBeepLevel', $event)" v-model="store.profile.values['fitBeepLevel']" />
          </div>
          <div class="flex items-center space-x-4">
            <span class="block w-44 flex-none">Number of shuttles</span>
            <b-input @input="onInputChange('fitBeepShuttles', $event)" v-model="store.profile.values['fitBeepShuttles']" />
          </div>
        </div>
      </template>

      <template v-else-if="+fitMethod === 0">
        <h3 class="font-light mt-0">Steptest</h3>

        <p class="text-base">Steady state</p>

        <div class="grid grid-cols-3 gap-x-4 gap-y-2">
          <span>Puls</span>
          <span>(Borg)</span>
          <span>Bänkhöjd</span>
          <b-input @input="onInputChange('fitPulseSteady', $event)" v-model="store.profile.values['fitPulseSteady']" />
          <b-select @change="onSelectChange('fitBorgSteady', $event)" v-model="store.profile.values['fitBorgSteady']">
            <option :value="null">&nbsp;</option>
            <option v-for="(v, i) in Array(15).keys()" :key="i" :value="v + 6">{{ v + 6 }}</option>
          </b-select>
          <b-select @change="onSelectChange('fitBenchSteady', $event)" v-model="store.profile.values['fitBenchSteady']">
            <option :value="null">&nbsp;</option>
            <option :value="33">33</option>
            <option :value="40">40</option>
          </b-select>
        </div>
      </template>

      <template v-else-if="+fitMethod === 1">
        <h3 class="font-light mt-0">Ergometercykel</h3>

        <p class="text-base">Steady state</p>

        <div class="grid grid-cols-3 gap-x-4 gap-y-2">
          <span>Puls</span>
          <span>(Borg)</span>
          <span>Watt</span>
          <b-input @input="onInputChange('fitBicPulseSteady', $event)" v-model="store.profile.values['fitBicPulseSteady']" />
          <b-select @change="onSelectChange('fitBicBorgSteady', $event)" v-model="store.profile.values['fitBicBorgSteady']">
            <option :value="null">&nbsp;</option>
            <option v-for="(v, i) in Array(15).keys()" :key="i" :value="v + 6">{{ v + 6 }}</option>
          </b-select>
          <b-select @change="onSelectChange('fitBicWattsSteady', $event)" v-model="store.profile.values['fitBicWattsSteady']">
            <option :value="null">&nbsp;</option>
            <option v-for="(v, i) in Array(10).keys()" :key="i" :value="(v + 2) * 25">{{ (v + 2) * 25 }}</option>
          </b-select>
        </div>
      </template>

      <template v-else-if="+fitMethod === 5">
        <h3 class="font-light mt-0">1-Mile walk test</h3>

        <ul class="text-base ml-0 pl-4 space-y-2">
          <li>
            Gå eller spring 12 minuter så snabbt du kan.<br>
            <span class="opacity-60">Ladda ner appen runkeeper som mäter sträckan du avverkat.</span>
          </li>
          <li>Ta pulsen: Lägg 3 fingrar mot halspulsådern, räkna antal slag under 15 sek och multiplicera sedan med 4 för att få antal slag per minut.</li>
        </ul>

        <div class="space-y-2">
          <div class="flex items-center space-x-4">
            <span class="block w-24 flex-none">Puls</span>
            <b-input @input="onInputChange('fitWalkPulse', $event)" v-model="store.profile.values['fitWalkPulse']" />
          </div>
          <div class="flex items-center space-x-4">
            <span class="block w-24 flex-none">Sträcka</span>
            <b-input @input="onInputChange('fitWalkDistance', $event)" v-model="store.profile.values['fitWalkDistance']" />
            <span>m</span>
          </div>
          <div class="flex items-center space-x-4">
            <span class="block w-24 flex-none">Minuter</span>
            <b-input @input="onInputChange('fitWalkMin', $event)" v-model="store.profile.values['fitWalkMin']" />
          </div>
          <div class="flex items-center space-x-4">
            <span class="block w-24 flex-none">Sekunder</span>
            <b-input @input="onInputChange('fitWalkSec', $event)" v-model="store.profile.values['fitWalkSec']" />
          </div>
        </div>
      </template>
    </div>

    <div v-if="showImprove" :class="borderColor" class="border-t border-0 border-solid mt-8 py-4 text-base">
      <div>Du har {{ factor?.label }}värde.</div>

      <ul class="flex flex-col m-0 mt-4 p-0">
        <li class="list-none">
          <b-radio
            :name="`fitness-improve`"
            :color="colorScheme"
            value="1"
            label="Detta är jag nöjd med"
            :label-id="`fitness-improve-1-label`"
            @change="handleImprove('1')"
            v-model="improve"
          />
        </li>

        <li class="list-none">
          <b-radio
            :name="`fitness-improve`"
            :color="colorScheme"
            value="2"
            label="Detta vill jag förbättra"
            :label-id="`fitness-improve-2-label`"
            @change="handleImprove('2')"
            v-model="improve"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
