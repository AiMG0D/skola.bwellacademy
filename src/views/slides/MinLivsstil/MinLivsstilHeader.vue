<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { useStore } from '@/stores/main';
import BProgressBar from '@/components/BProgressBar.vue';
import BSubpageIcon from '@/components/BSubpageIcon.vue';
import Star from '@/components/icons/Star.vue';
import Globe from '@/components/illustrations/Globe.vue';

const props = defineProps({
  currentSectionIdx: Number,
  currentPageIdx: Number,
  questionCount: Number,
  sections: Array,
  showProgress: Boolean,
  isResultsPage: Boolean,
});

const emit = defineEmits<{
  (e: 'slide', value: number): void;
}>();

const currentSection = inject('currentSection');
const subpageData = inject('subpageData', '');
const colorScheme = inject('colorScheme', 'green');
const setSection = inject('setSection');

const store = useStore();

const sectionIcons = computed(() => props.sections?.map((section, idx) => ({
  idx: idx + 1,
  icon: section.pageName,
})));

const sectionChecks = computed(() => {
  return props.sections?.map((section) => {
    const groupsWithFactors = section.groups.filter((group) => group.category_id !== undefined && group.category_id !== null && group.category_id !== 0);
    const answeredQuestions = groupsWithFactors
      .map((group) => group.category_id)
      .reduce((acc, category) => {
        const factor = store.profile?.factors?.[category];
        const v = factor?.value;
        if (v == null) {
          return acc;
        }
        return acc + (v !== '' ? 1 : 0)
      }, 0);

    return answeredQuestions > 0 && answeredQuestions === groupsWithFactors.length;
  });
});

const headerColor = computed(() => {
  return {
    purple: 'bg-purple-light',
    yellow: 'bg-yellow-light',
    green: 'bg-green-light',
    blue: 'bg-blue-light',
  }[colorScheme];
});

const textColor = computed(() => {
  return {
    purple: 'text-purple-darker',
    yellow: 'text-yellow-darker',
    green: 'text-green-darker',
    blue: 'text-blue-darker',
  }[colorScheme];
});

const headerHeight = computed(() => props.currentSectionIdx > 0 ? 'h-[172px]' : 'h-[112px]');

function onBarSlide(e: any) {
  emit('slide', e);
}
</script>

<template>
  <div :class="[headerHeight, headerColor]" class="transition-[height]">
    <div class="grid grid-rows-1 grid-cols-[1fr_3fr_1fr] items-center h-[112px]">
      <span class="text-4xl text-white font-black place-self-start pl-6 pt-8">2.</span>

      <div :class="textColor" class="text-center">
        <h1 class="m-0 text-[20px]">Min livsstil</h1>
        <h2
          class="m-0 text-sm"
          v-if="currentSection !== null"
          v-text="currentSection.pageLabel"
        ></h2>
      </div>

      <Globe v-if="currentSectionIdx === 0" />
    </div>

    <div class="flex justify-center gap-x-2 -mt-6 mb-2" v-show="currentSectionIdx > 0">
      <button v-for="(section, index) in sectionIcons" :key="section.idx" @click="setSection(section.idx)" class="bg-transparent">
        <b-subpage-icon
          :icon="section.icon"
          :active="currentSectionIdx === section.idx"
          :small="true"
          :header="true"
          :checked="sectionChecks[index]"
        />
      </button>

      <button class="bg-transparent">
        <b-subpage-icon
          icon="info"
          :small="true"
          :header="true"
          :active="currentSectionIdx === sectionIcons.length + 2"
          @click="setSection(sectionIcons.length + 2)"
        />
      </button>
    </div>

    <div class="px-8" v-if="currentSectionIdx > 0 && showProgress">
      <b-progress-bar :current="currentPageIdx || 0" :max="questionCount || 0" @slide="onBarSlide" interactive />
    </div>

    <div
      v-show="isResultsPage"
      class="flex justify-center items-center mt-5 text-sm tracking-[0.5rem] font-medium uppercase text-purple-darker relative"
    >
      <star class="mr-4" />
      <span class="relative top-[1px]">Resultat</span>
      <star class="ml-2" />
    </div>
  </div>
</template>
