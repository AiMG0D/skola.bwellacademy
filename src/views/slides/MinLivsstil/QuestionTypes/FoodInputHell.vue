<script setup lang="ts">
import { ref } from 'vue';
import { IonModal } from '@ionic/vue';
import type { ProfileValueChange } from '@/types';
import Chevron from '@/components/icons/Chevron.vue';
import Info from '@/components/icons/Info.vue';
import monsterUrl from '/assets/monster.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
import { useDebounceFn } from '@vueuse/core';
import { useStore } from '@/stores/main';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const showHelp = ref(false);
const store = useStore();

const inputs = [
  {
    label: 'Frukost',
    name: 'Breakfast',
    desc: '',
    inputs: [
      'Mjölk/fil/yoghurt (ca 3 dl) + flingor såsom cornflakes (330 kcal)',
      'Mjölk/fil/yoghurt (ca 3 dl) + musli/granola (340 kcal)',
      'Havregrynsgröt med sylt/äpplemos och mjölk (340 kcal)',
      '1 grov smörgås med smör + pålägg som skinka + ost (190 kcal)',
      '1 ljus smörgås med smör + ost + marmelad (190 kcal)',
      'Ägg/stekt ägg/äggröra (85 kcal)',
      'Knäckebröd med smör (120 kcal)',
      '1 glas mjölk/juice/havredryck etc. (3 dl) (140 kcal)',
      '1 glas chokladdryck (3dl) (200 kcal)',
      '1 smoothie av t.ex. yoghurt/kvarg/mjök + bär (ca 3-4 dl) (300 kcal)',
      'Kaffe/te (0 kcal)',
    ],
  },
  {
    label: 'Lunch',
    name: 'Lunch',
    desc: 'Om du upplever att du äter en stor portion eller tar två portioner eller vid fler tillfälle under dagen så matar du in fler än en portion.',
    inputs: [
      '1 portion spagetti och köttfärsås (450 kcal)',
      '1 portion lax med potatismos + ärtor (560 kcal)',
      '1 kycklingfilé med ris + sås (465 kcal)',
      '2-3 potatis + 2 biffar/köttbullar (7-10 st) + brunsås + lingonsylt (470 kcal)',
      '1 portion makaroner + falukorv med ketchup (535 kcal)',
      '1 dl blandade grönsaker som wok/djupfrysta grönsaks blandning med lite olja (35 kcal)',
      '1 dl blandad sallad/gurka/tomat/paprika (11 kcal)',
      '1 portion snabbnudlar (90 kcal)',
      '1 portion soppa såsom köttsoppa/broccolisoppa/gulaschsoppa (250 kcal)',
      '1 korv med bröd + senap + ketchup (272 kcal)',
      'Matsallad som pastasallad med räkor/ägg/kyckling/skinka + dressing (300 kcal)',
      'Hamburgare + pommes + cola d.v.s. ett meal (1140 kcal)',
      '1 köpt pizza (730 kcal)',
      '1 glas mjölk (3 dl) (140 kcal)',
      '1 cola/1 öl/1 glas vin (130 kcal)',
    ],
  },
  {
    label: 'Fika/snacks',
    name: 'Snacks',
    desc: '',
    inputs: [
      'Kexchoklad/dajm/snickers (annan chokladkaka) (230 kcal)',
      'Risifrutti (220 kcal)',
      'Bulle/sockerkaka (170 kcal)',
      'Energibar/sportbar såsom Barbells (220 kcal)',
      'Banan/avokado (100 kcal)',
      'Äpple/apelsin/päron (50 kcal)',
      'Liten påse chips/ostbågar/popcorn (100g) (525 kcal)',
      'Nötter 50 gram (olika sorter) (300 kcal)',
      'Glasstrut/glass pinne (såsom magnum) (200 kcal)',
      'Plockgodis (1 hg) (400 kcal)',
      'Brieost (ca 50g) (180 kcal)',
      'Digestivekex (1 st) (70 kcal)',
    ],
  },
  {
    label: 'Middag',
    name: 'Dinner',
    desc: '',
    inputs: [
      '1 portion spagetti och köttfärsås (450 kcal)',
      '1 portion lax med potatismos + ärtor (560 kcal)',
      '1 kycklingfilé med ris + sås (465 kcal)',
      '2-3 potatis + 2 biffar/köttbullar (7-10 st) + brunsås + lingonsylt (470 kcal)',
      '1 portion makaroner + falukorv med ketchup (535 kcal)',
      '1 dl blandade grönsaker som wok/djupfrysta grönsaks blandning med lite olja (35 kcal)',
      '1 dl blandad sallad/gurka/tomat/paprika (11 kcal)',
      '1 portion snabbnudlar (90 kcal)',
      '1 portion soppa såsom köttsoppa/broccolisoppa/gulaschsoppa (250 kcal)',
      '1 korv med bröd + senap + ketchup (272 kcal)',
      'Matsallad som pastasallad med räkor/ägg/kyckling/skinka + dressing (300 kcal)',
      'Hamburgare + pommes + cola d.v.s. ett meal (1140 kcal)',
      '1 köpt pizza (730 kcal)',
      '1 glas mjölk (3 dl) (140 kcal)',
      '1 cola/1 öl/1 glas vin (130 kcal)',
    ],
  },
  {
    label: 'Kvällsmål',
    name: 'Eveningmeal',
    desc: '',
    inputs: [
      'Mjölk/fil/yoghurt (ca 3 dl) + flingor såsom cornflakes (330 kcal)',
      'Mjölk/fil/yoghurt (ca 3 dl) + musli/granola (340 kcal)',
      'Havregrynsgröt med sylt/äpplemos och mjölk (340 kcal)',
      '1 grov smörgås med smör + pålägg som skinka + ost (190 kcal)',
      '1 ljus smörgås med smör + ost + marmelad (190 kcal)',
      'Ägg/stekt ägg/äggröra (85 kcal)',
      'Knäckebröd med smör (120 kcal)',
      '1 glas mjölk/juice/havredryck etc. (3 dl) (140 kcal)',
      '1 glas chokladdryck (3dl) (200 kcal)',
      '1 smoothie av t.ex. yoghurt/kvarg/mjök + bär (ca 3-4 dl) (300 kcal)',
      'Kaffe/te (0 kcal)',
    ],
  },
];

const open = ref(Array(inputs.length).fill(false));

function toggleOpen(index: number) {
  open.value[index] = !open.value[index];
  emit('update');
}

const handleChange = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  if (value === '') {
    value = '0';
  }
  emit('change', { name: target.name, value });
}, 750);
</script>

<template>
  <div class="flex flex-col gap-y-2 mb-2">
    <button @click="showHelp = true" class="text-left px-4 py-2 mb-2 bg-green-light rounded text-base flex items-center">
      <Info class="text-green-darker shrink-0 mr-2" width="20" />
      <span class="relative top-[1px]">Instruktioner</span>
    </button>

    <ion-modal :is-open="showHelp" @did-dismiss="showHelp = false">
      <div class="px-8 bg-green-background h-full text-base font-sans">
        <div class="flex items-end">
          <img class="monster w-[35%]" :src="monsterUrl">

          <div class="relative flex">
            <span class="absolute w-[150px] text-center font-light text-[18px] top-[45px] left-[40px] z-10 rotate-0">Du vet nu att du måste ha balans mellan ditt energi<wbr>behov och ditt energiintag. Nu ska vi se om det är så.</span>
            <speech-bubble color="purple" class="w-[100%] -z-5 rotate-[130deg]" />
          </div>
        </div>

        <p>
          En tumregel är att
          <ul>
            <li>10 - 20 procent kommer från protein (såsom mjölkprodukter, ägg, kött, ärt- och baljväxter)</li>
            <li>25 - 40 från fett (såsom smör, grädde, nötter, frö och olja)</li>
            <li>45 - 60 från kolhydrater (såsom bröd, flingor, pasta, frukt och grönsaker)</li>
          </ul>
        </p>

        <p>
          Följer du denna tumregel?<br>
          Mata in vad du vanligtvis äter vid respektive måltid. Välj en vanlig dag under de senaste 7 dagarna. Hur äter du?
        </p>

        <div class="flex justify-center mt-10">
          <b-button @click="showHelp = false">Stäng</b-button>
        </div>
      </div>
    </ion-modal>

    <div class="flex mb-2">
      <Info class="text-green-darker shrink-0 mr-2" width="20" />
      <p class="text-base leading-normal m-0">
        Om du upplever att du äter en stor portion eller tar två portioner eller vid fler tillfälle under dagen så matar du in fler än en portion.
      </p>
    </div>

    <div v-for="(section, sectionIdx) in inputs" class="text-base">
      <button
        @click="toggleOpen(sectionIdx)"
        class="flex w-full justify-between text-base px-4 py-2 text-green-darker bg-green-light rounded-md"
      >
        <span class="sr-only">Öppna sektionen</span> {{ section.label }}

        <Chevron :direction="open[sectionIdx] ? 'up' : 'down'" />
      </button>

      <div v-show="open[sectionIdx]">
        <ul class="flex flex-col p-0 list-none gap-y-2">
          <li v-for="(input, index) in section.inputs" class="flex items-start">
            <input
              min="0"
              type="number"
              class="w-12 rounded border-solid border border-green-light shadow"
              :id="`energyIntake${section.name}${index + 1}`"
              :name="`energyIntake${section.name}${index + 1}`"
              @input="handleChange"
              :value="store.profile.values[`energyIntake${section.name}${index + 1}`]"
            >
            <label :for="`energyIntake${section.name}${index + 1}`" v-text="input" class="ml-2 leading-relaxed"></label>
          </li>
        </ul>
      </div>
    </div>

    <div>Ditt kcaloriintag är {{ store.profile.values['foodEnergyIntake'] ?? 0 }} kcal</div>
  </div>
</template>
