<script setup lang="ts">
import ImageViewer from "@/components/ImageViewer.vue";
import {modalController} from "@ionic/vue";
import { computed, inject } from 'vue';
import BJointRadioItem from '@/components/BJointRadioItem.vue';
import type { ProfileValueChange } from '@/types';
import Info from '@/components/icons/Info.vue';

defineProps({
  data: Object,
});

defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const helpTexts = {
  'neckBendL': 'Om du inte har Bwell vinkelskiva 45° kan du vika en A4 - sida så du får en rät vinkel och två 45 ° hörn. Placera den långa sidan (hypotenusan) från näsan lodrätt mot hjässan. Kan du då få den korta sidan (kateten) att peka vågrätt från halsen?',
  'backRotL': 'Sitt bakvänt på en stol med ryggstöd som på bilden så att du låser höften. Ta ett kvastskaft och  håll som förlängning av axlarna som på bilden. Skaftet ska kunna vinklas 60 grader ( 1/3 av  180 ° använd gärna en tumstock som du vinklar i ca 60 °)',
  'backBendL': 'Använd en linjal. Låt kamrat mäta från ett av fingrarna om du kan böja 20 cm.',
  'brstStretch': 'Låt kamrat stå bakom dig och hålla föremål som är 5 cm mot dina axelkulor. Ex två pennstumpar som du skurit av.',
};

const colorScheme = inject('colorScheme', 'green');
const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme];
});

const buttonClasses = computed(() => {
  return [
    // !open ? 'border-b' : '',
    // 'border-l-0',
    // 'border-t-0',
    // 'border-r-0',
    // 'border-black',
    // 'border-solid',
    'w-full',
    'bg-transparent',
    'py-4',
    'text-base',
    'text-green-darker',
    'font-medium',
  ];
});

function addLabel(str: string) {
  if (!(str in Object.keys(helpTexts))) {
    return str;
  }

  return `${str} (Görs endast med certifierad Bwell-coach)`;
}

async function showPoster(poster: string) {
  const modal = await modalController.create({
    component: ImageViewer,
    componentProps: {
      poster
    }
  });

  await modal.present();

  await modal.onWillDismiss();
}
</script>

<template>
  <div v-if="data.label !== ''" class="mt-4">
    {{ data.label }}
  </div>
  <div>
    <div :class="buttonClasses" v-if="data.description !== ''" v-html="data.description"></div>
    <div class="mt-4" v-else></div>

    <div v-show="true" class="-mx-8 px-8">
      <div v-if="data.poster.url !== null" class="mb-4 flex">
        <a @click.prevent="showPoster(data.poster.url)" href="#" target="_blank" class="flex items-center gap-x-1 underline text-black">
          <Info class="text-green-darker" width="20" />
          <span class="text-base leading-none relative top-[1px]">Tryck här för att se {{ data.poster.text }}</span>
        </a>
      </div>

      <div v-if="helpTexts[data.name]" class="flex text-base gap-x-1 mb-4 items-start">
        <Info class="text-green-darker shrink-0 mt-0.5" width="20" />
        {{ helpTexts[data.name] }}
      </div>

      <ul :class="borderColor" class="flex border border-solid shadow rounded-lg m-0 p-0 bg-white">
        <b-joint-radio-item
          v-for="(answer, idx) in data.data"
          class="flex-1 text-base text-center py-2 border-0 last:border-l last:border-solid last:border-l-slate-200"
          :color="colorScheme"
          :name="data.name"
          :data="answer"
          :index="idx"
          @picked="$emit('change', { name: data.name, value: answer.value })"
        />
      </ul>
    </div>
  </div>
</template>
