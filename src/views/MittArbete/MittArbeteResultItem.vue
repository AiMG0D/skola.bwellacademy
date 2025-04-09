<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useTimeout } from '@vueuse/core';
import Chevron from '@/components/icons/Chevron.vue';
import Checkbox from '@/components/icons/Checkbox.vue';
import BFactorPlanItem from '@/components/BFactorPlanItem.vue';
import BFactorPlan from '@/components/BFactorPlan.vue';
import type { FactorGoal, GoalPlan } from '@/types';

const props = defineProps(['categoryId', 'checked', 'data', 'vision']);

const emit = defineEmits<{
  (e: 'saved', plan: GoalPlan): void;
}>();

const today = new Date();

const open = ref(false);
const isChecked = ref(props.checked ?? false);
const date = ref(today.toISOString().split('T')[0]);
const showDateError = ref(false);
const factorPlans = ref<Record<number, FactorGoal>>(setupInitialFactorPlans());

watch(date, () => showDateError.value = false);

const minDate = today.toISOString().split('T')[0];

const classes = computed(() => {
  return [
    'flex',
    'items-center',
    'w-full',
    open.value ? 'rounded-t-md' : 'rounded-md',
    'text-base',
    'bg-yellow-light',
    'text-yellow-darker',
    'px-4',
    'py-3',
    'font-medium',
  ];
});

function setupInitialFactorPlans() {
  let out = {};

  const affectedByIds = props.data.affected_by_factors.map((f) => f.category_id);

  for (let factor of props.data.factors) {
    if (!affectedByIds.includes(factor.category_id) && factor.category_id !== props.categoryId) {
      continue;
    }

    out[factor.category_id] = {
      checked: true,
      plan: factor.plan
    }
  }

  return out;
}

function save() {
  if (date.value === '') {
    showDateError.value = true;
    useTimeout(5000, { callback: () => showDateError.value = false });
    return;
  }

  const factors = Object.fromEntries(
    Object.entries(factorPlans.value).filter(([categoryId, factorPlan]) => factorPlan.checked)
  );

  for (const factor of Object.values(factors)) {
    if (factor.checked && factor.plan === '') {
      return;
    }
  }

  isChecked.value = true;
  open.value = false;

  emit('saved', {
    categoryId: props.categoryId,
    date: date.value,
    factors,
  });
}
</script>

<template>
  <li class="block shadow-md rounded-md">
    <button :class="classes" @click="open = !open">
      <Checkbox :checked="isChecked" class="mr-2" />

      <div><slot></slot></div>

      <Chevron class="ml-auto" :direction="open ? 'up' : 'down'" />
    </button>

    <div v-show="open" class="p-6 rounded-b-md bg-white">
      <p class="mt-0 text-base">Jag har valt att öka mitt värde till {{ vision }}.</p>

      <template v-if="data.affected_by_factors.length > 0">
        <p class="text-base">Nedan ser du de delar som påverkar eller påverkas av ditt mål. Välj de som du tror hjälper dig att nå ditt mål. Skriv jättekort HUR du ska göra.</p>

        <ul class="m-0 p-0 flex flex-col gap-y-2">
          <b-factor-plan-item
            v-for="factor in data.affected_by_factors"
            v-model="factorPlans[factor.category_id]"
          >
            {{ factor.label }}
          </b-factor-plan-item>
        </ul>
      </template>
      <template v-else>
        <b-factor-plan v-model="factorPlans[categoryId]" />
      </template>

      <p class="mb-1 text-base">Jag vill att mitt mål ska uppnås:</p>

      <fieldset class="text-yellow-dark border-yellow-dark border-solid rounded">
        <legend>Datum</legend>

        <input type="date" class="border-0 w-full text-black" v-model="date" :min="minDate">

        <p v-if="showDateError" class="mt-4 mb-0 text-red-500 font-medium text-sm">Du måste fylla i ett datum.</p>
      </fieldset>

      <div class="flex flex-col items-center mt-6">
        <b-button @click="save">Spara</b-button>
      </div>
    </div>
  </li>
</template>
