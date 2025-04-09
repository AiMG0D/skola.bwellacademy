<script setup lang="ts">
import Cigarette from "@/components/icons/Cigarette.vue";
import Flower from "@/components/icons/Flower.vue";
import Food from "@/components/icons/Food.vue";
import Handball from "@/components/icons/Handball.vue";
import HandHeart from "@/components/icons/HandHeart.vue";
import People from "@/components/icons/People.vue";
import PersonCheck from "@/components/icons/PersonCheck.vue";
import PieChart from "@/components/PieChart.vue";
import {computed, ref} from "vue";

type SectionResult = {
  pageName: string;
  pageLabel: string;
  count: number;
  results: {
    healthy: number;
    risks: number;
    unknowns: number;
  };
  done: boolean;
  factors: {
    name: string;
    value: number;
  }[];
}

const props = defineProps<{
  sections: any[];
  factors: any;
}>();

const sectionResults = computed(() => {
  if (!props.sections) {
    return [];
  }

  const results = [];

  for (const section of props.sections) {
    if(section.pageName === 'kasam') {
      const factor = props.factors[24];

      let value = factor && factor.value && factor?.status !== 'unknown' ? Math.round(+factor.value / 7 * 5) : 0;

      results.push({
        pageName: section.pageName,
        pageLabel: section.pageLabel,
        count: 1,
        results: {
          healthy: value >= 3 ? 1 : 0,
          risks: value < 3 ? 1 : 0,
          unknowns: factor ? 0 : 1,
        },
        done: value > 0,
        factors: [{
          name: 'KASAM',
          value,
        }]
      } as SectionResult);
    } else {

      const groupsWithFactors = section
        .groups
        .filter((group: any) => {
          return group.category_id !== null && (group.can_improve || group.category_id === 24) && group.label !== 'physical-strength-results'
        });
      if (groupsWithFactors.length === 0) {
        continue;
      }
      const answeredCategories = groupsWithFactors.map((group: any) => group.category_id);

      let factors = groupsWithFactors.map((g: any) => {
        const factor = props.factors[g.category_id]
        let value = factor && factor.value && factor?.status !== 'unknown' ? +factor.value : undefined;

        if(factor && factor.risk_value !== undefined) {
          value = +factor.risk_value;
        }

        return {
          name: g.label,
          value,
        };
      });

      let risks = 0;
      let healthy = 0;
      let unknowns = 0;

      for (const category of answeredCategories) {
        const factor = props.factors[category];

        if (factor?.status === 'profile.healthy' || factor?.status === 'healthy') {
          ++healthy;
        } else if (factor?.status === 'profile.risk' || factor?.status === 'risk') {
          ++risks;
        } else {
          ++unknowns;
        }
      }

      if (section.pageName === 'physical')
      {
        let factor = props.factors[4];

        if (factor?.status === 'profile.healthy' || factor?.status === 'healthy') {
          ++healthy;
        } else if (factor?.status === 'profile.risk' || factor?.status === 'risk') {
          ++risks;
        } else {
          ++unknowns;
        }

        factors.push({
          name: "Konditionstest",
          value: factor?.risk_value || factor?.value || undefined,
        });
      }

      let pageLabel = section.pageLabel;

      results.push({
        pageName: section.pageName,
        pageLabel,
        count: healthy + risks + unknowns,
        results: { healthy, risks, unknowns },
        done: unknowns === 0,
        factors
      } as SectionResult);
    }
  }

  return results;
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

const iconColors = [
  'text-black/50',
  'text-black/60',
  'text-black/60',
  'text-black/50',
  'text-black/60',
  'text-black/60',
];

function circleSegmentFill(section: any) {
  if (section.results.unknowns) {
    return fillColors[0];
  }

  const sum: number = section.factors.map((f: any) => f.value).reduce((a: number, c: number) => a + c);
  const value: number = Math.round(sum / section.factors.length);

  return fillColors[value];
}

const totalAverageScore = computed(() => {
  if(sectionResults.value.length < 1) {
    return 0;
  }

  if (!sectionResults.value.every(s => s.results.unknowns <= 0)) {
    return 0;
  }

  return sectionResults.value.map((section: any) => {
    return section.factors.map((f: any) => f.value).reduce((a: number, c: number) => a + c) / section.factors.length;
  }).reduce((a: number, c: number) => a + c) / sectionResults.value.length;
});

function middleCircleFill() {
  return fillColors[Math.round(totalAverageScore.value)];
}

const iconDist = 23;
const iconHilightDist = 25;

function highlightIcon(index: number, total: number) {

  if(index === selectedSlice.value) {
    let a = ((index + 0.5) / total) * Math.PI * 2;
    return `translate3d(-50%, -50%, 0) translate3d(${Math.sin(a) * iconHilightDist}px, ${-Math.cos(a) * iconHilightDist}px, 0) scale(1.25)`;
  }

  return `translate3d(-50%, -50%, 0)`;
}

function icon(index: number) {
  return [Handball, PersonCheck, HandHeart, Cigarette, Food, Flower, People][index];
}

function iconX(index: number, total: number) {
  let a = ((index + 0.5) / total) * Math.PI * 2;

  return (50 + Math.sin(a) * iconDist) + '%';
}

function iconY(index: number, total: number) {
  let a = ((index + 0.5) / total) * Math.PI * 2;

  return (50 - Math.cos(a) * iconDist) + '%';
}

function iconColor(section: any) {
  if (section.results.unknowns) {
    return iconColors[0];
  }

  return iconColors[1 + Math.floor((section.results.healthy / section.count) * 4)];
}

const selectedSlice = ref<number | null>(null);

function highlightSwatch(index: number)
{
  if(selectedSlice.value === null) {
    return null;
  }

  const section = sectionResults.value[selectedSlice.value];
  const sum: number = section.factors.map((f: any) => f.value).reduce((a: number, c: number) => a + c);
  const value: number = Math.round(sum / section.factors.length);

  return value === index ? 'scale-125 border border-solid border-white' : null;
}

const chartColors = computed(() => {
  return sectionResults.value.map(section => {
    return circleSegmentFill(section);
  });
});

</script>

<template>
  <div class="px-8 -mt-6">
    <div class="relative">
      <PieChart :segments="sectionResults.length" :colors="chartColors" v-model="selectedSlice" />

      <template v-for="(section, index) in sectionResults">
        <component :is="icon(index)"
                   :class="['absolute transition origin-center scale-125 pointer-events-none', iconColor(section)]"
                   :style="{left: iconX(index, sectionResults.length), top: iconY(index, sectionResults.length), transform: highlightIcon(index, sectionResults.length)}"/>
      </template>
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

    <transition
      enter-from-class="!grid-rows-[0fr]"
      leave-to-class="!grid-rows-[0fr]"
    >
      <div v-if="selectedSlice !== null" class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[400ms]">
        <div class="overflow-hidden">
          <h3 class="font-normal m-0 mb-3 text-lg">{{ sectionResults[selectedSlice].pageLabel }}</h3>
          <ul class="list-none m-0 p-0 pl-0.5 pb-8 space-y-4 text-base">
            <li class="flex space-x-4 items-start" v-for="(factor, index) in sectionResults[selectedSlice].factors" :key="index">
              <span :class="['flex-none inline-block w-3 h-3 mt-0.5 rounded-full outline outline-1', bgColors[factor.value || 0]]"></span>
              <div class="space-y-2">
                <div class="leading-[1rem]">{{ factor.name }}</div>
                <div class="leading-[0.75em] text-xs opacity-70">
                  <span v-if="factor.value">Värde: {{ factor.value }} - {{ factor.value < 3 ? 'Risk' : 'Frisk' }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">

</style>
