<script setup lang="ts">
import PieChart from "@/components/PieChart.vue";
import {computed, ref} from "vue";

const props = defineProps<{
  questions: any[];
  factors: any;
}>();

const questionResults = computed(() => {
  const results = [];

  for (const question of props.questions) {
    const factor = props.factors[question.category_id];
    if (factor == null) {
      results.push({
        category: question.category_id,
        label: question.label,
        answered: false,
        value: null,
        status: 'unknown',
      });
      continue;
    }

    results.push({
      category: question.category_id,
      label: question.label,
      answered: factor?.value !== '' ?? false,
      value: factor.value,
      status: factor.status,
    });
  }

  return results;
});

const selectedSlice = ref<number | null>(null);

const segmentColors = computed(() => {
  return questionResults.value.map(sr => {
    return fillColor(+sr.value || 0);
  });
});

const segmentLabels = computed(() => {
  let index = 1;
  return questionResults.value.map(sr => {
    return '' + (index++);
  });
});

const fillColors = [
  'fill-white',
  'fill-red-400',
  'fill-orange-400',
  'fill-amber-300',
  'fill-lime-300',
  'fill-green-400'
];

const bgColors = [
  'bg-white',
  'bg-red-400',
  'bg-orange-400',
  'bg-amber-300',
  'bg-lime-300',
  'bg-green-400'
];

function fillColor(status: number): string {
  return fillColors[status];
}

function highlightSwatch(index: number)
{
  if(selectedSlice.value === null) {
    return null;
  }

  return +questionResults.value[selectedSlice.value].value === index ? 'scale-125 border border-solid border-white' : null;
}
</script>

<template>
  <div class="px-8 -mt-6">
    <div class="aspect-square relative">
      <PieChart v-model="selectedSlice" :colors="segmentColors" :labels="segmentLabels" :segments="questionResults.length" />
    </div>

    <div class="flex justify-center space-x-2 items-center text-base mb-5 -mt-1">
      <div class="flex-1 flex text-sm items-center">
        <div class="flex-1 border-0 border-t border-solid border-black/30"></div>
        <div class="px-1">Risk</div>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex space-x-2">
          <span :class="['flex items-center justify-center w-5 h-5 outline outline-1 rounded-full text-sm transition', bgColors[1], highlightSwatch(1)]">1</span>
          <span :class="['flex items-center justify-center w-5 h-5 outline outline-1 rounded-full text-sm transition', bgColors[2], highlightSwatch(2)]">2</span>
        </div>
      </div>
      <div class="flex flex-col items-center">
        <div class="flex space-x-2">
          <span :class="['flex items-center justify-center w-5 h-5 outline outline-1 rounded-full text-sm transition', bgColors[3], highlightSwatch(3)]">3</span>
          <span :class="['flex items-center justify-center w-5 h-5 outline outline-1 rounded-full text-sm transition', bgColors[4], highlightSwatch(4)]">4</span>
          <span :class="['flex items-center justify-center w-5 h-5 outline outline-1 rounded-full text-sm transition', bgColors[5], highlightSwatch(5)]">5</span>
        </div>
      </div>
      <div class="flex-1 flex text-sm items-center">
        <div class="px-1">Frisk</div>
        <div class="flex-1 border-0 border-t border-solid border-black/30"></div>
      </div>
    </div>

    <div>
      <transition
        enter-from-class="!grid-rows-[0fr]"
        leave-to-class="!grid-rows-[0fr]"
      >
        <div v-if="selectedSlice !== null" class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[400ms]">
          <div class="overflow-hidden">
            <h3 class="my-0 text-yellow-darker text-base" v-text="questionResults[selectedSlice].label"></h3>

            <div class="text-sm font-light mt-1">
              <template v-if="questionResults[selectedSlice].status === 'profile.healthy'">
                <div class="text-base font-medium mb-1">Frisk</div>
                <div>Du är på rätt väg för att må bra i framtiden. Bygg vidare på det!</div>
              </template>
              <template v-else>
                <div class="text-base font-medium mb-1">Risk</div>
                <div>Se upp för kommande ohälsa.</div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div class="h-8"></div>
  </div>
</template>

<style scoped lang="postcss">

</style>
