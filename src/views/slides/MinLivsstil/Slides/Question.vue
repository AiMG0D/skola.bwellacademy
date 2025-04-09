<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { IonSpinner } from '@ionic/vue';
import List from '../QuestionTypes/List.vue';
import Joint from '../QuestionTypes/Joint.vue';
import Cooper from '../QuestionTypes/Cooper.vue';
import Textbox from '../QuestionTypes/Textbox.vue';
import FoodInputHell from '../QuestionTypes/FoodInputHell.vue';
import EnergyInformation from '../QuestionTypes/EnergyInformation.vue';
import EnergyResults from '../QuestionTypes/EnergyResults.vue';
import Alcohol from '../QuestionTypes/Alcohol.vue';
import FoodBreakfast from '../QuestionTypes/FoodBreakfast.vue';
import Pushup from '../QuestionTypes/Pushup.vue';
import TwoValues from "../QuestionTypes/TwoValues.vue";
import type { ProfileValueChange } from '@/types';
import { useStore } from '@/stores/main';
import { useDebounceFn } from '@vueuse/core';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'update'): void;
}>();

const colorScheme = inject('colorScheme', 'green');

const store = useStore();

const loading = ref(false);

const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme] ?? 'border-green-light';
});

const factor = computed(() => store.profile.factors?.[props.data.category_id]);

function questionComponent(type: string) {
  switch (type) {
    case 'fitness-cooper':
      return Cooper;
    case 'list-item':
      return List;
    case 'joint':
      return Joint;
    case 'textbox':
      return Textbox;
    case 'energy-intake':
      return FoodInputHell;
    case 'energy-needs':
      return EnergyInformation;
    case 'energy-balance':
      return EnergyResults;
    case 'alcohol':
      return Alcohol;
    case 'pushups':
      return Pushup;
    case 'twovalues':
      return TwoValues;
    default:
      console.log('missing question component:', type);
      return undefined;
  }
}

const handleChangeDebounced = useDebounceFn(async (e: ProfileValueChange) => {
  await _handleChange(e);
}, 750);

async function _handleChange(e: ProfileValueChange) {
  if (e === undefined || e === null || e.value === null || e.value?.trim() === '') {
    return;
  }

  loading.value = true;
  const result = await store.setProfileValue(e.name, e.value);
  loading.value = false;

  if (result === null) {
    return;
  }

  emit('saved');
}

const handleChange = (e: any, type: string) => {
  if(type === 'list-item' || type === 'joint' || type === 'alcohol') {
    _handleChange(e);
  } else {
    handleChangeDebounced(e);
  }
};

async function handleImprove(group, value: string) {
  loading.value = true;
  const result = await store.setImproveValue(group.category_id, value);
  loading.value = false;

  if (result === null) {
    return;
  }
}

const improve = computed(() => {
  return factor.value?.improve || null;
});
</script>

<template>
  <div class="flex flex-col w-full px-8 py-6 overflow-hidden" :data-factor="data?.improve_name ?? 'null'">
    <div class="flex items-center gap-x-4 mt-2 mb-1">
      <h3 v-if="data.label !== 'Frågor'" class="m-0 font-light" v-text="`${data.label}`"></h3>
    </div>

    <template v-for="question in data.questions">
      <component
        :is="questionComponent(question.type)"
        :data="question"
        @change="handleChange($event, question.type)"
        @update="$emit('update')"
      />

      <template v-if="question.subquestions">
        <template v-for="subquestion in question.subquestions">
          <template v-if="+store.profile.values[question.name] < +subquestion.toggle_value">
            <component
              :is="questionComponent(subquestion.type)"
              :data="subquestion"
              @change="handleChange($event, subquestion.type)"
              @update="$emit('update')"
            />
          </template>
        </template>
      </template>
    </template>

    <div
      v-if="factor && (factor?.value !== '' && factor?.value != '-1' && factor?.status !== 'unknown') && data.can_improve"
      class="border-t border-0 border-solid py-4 text-base mt-6"
      :class="borderColor"
      :data-category="data.category_id"
    >
      <ion-spinner v-if="loading" />
      <template v-else>

        <div v-if="data.improve_name === 'agility'" class="mb-6">
          Här ser du ditt samlade resultat på rörlighet.
        </div>

        <span>Du har {{ factor?.label }}värde.</span>

        <ul class="flex flex-col m-0 p-0">
          <li class="list-none">
            <b-radio
              :name="`${data.improve_name}-improve`"
              :color="colorScheme"
              value="1"
              label="Detta är jag nöjd med"
              :label-id="`${data.improve_name}-improve-1-label`"
              @change="handleImprove(data, '1')"
              v-model="improve"
            />
          </li>

          <li class="list-none">
            <b-radio
              :name="`${data.improve_name}-improve`"
              :color="colorScheme"
              value="2"
              label="Detta vill jag förbättra"
              :label-id="`${data.improve_name}-improve-2-label`"
              @change="handleImprove(data, '2')"
              v-model="improve"
            />
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>
