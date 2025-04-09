<script setup lang="ts">
import BRadioItem from '@/components/BRadioItem.vue';
import BreakfastLarge from '@/components/food-illustrations/BreakfastLarge.vue';
import BreakfastMedium from '@/components/food-illustrations/BreakfastMedium.vue';
import BreakfastSmall from '@/components/food-illustrations/BreakfastSmall.vue';
import Info from '@/components/icons/Info.vue';
import {useStore} from '@/stores/main';
import {FmsType} from "@/types";
import {inject, ref} from 'vue';

const store = useStore();

const fmsType: FmsType = inject('fms-type') as  FmsType;

const showExplanation = ref(false);
const explanationType = ref('small');

function openExplanation(type) {
  explanationType.value = type;
  showExplanation.value = true;
}

async function handleChange(value) {
  await store.setProfileValue('energyIntakeNewBreakfast', value);
}
</script>

<template>
  <div class="px-8 mt-8 pb-8 gap-y-4 w-full">
    <h3 class="m-0 font-light">Frukost</h3>

    <p class="text-base mt-1">Hur ser din frukost oftast ser ut. Äter du liten, mellanstor eller stor frukost?</p>

    <dialog :open="showExplanation" class="bg-green-light border-none rounded-md shadow-2xl z-50 mt-6 mx-auto explanation-dialog">
      <div class="flex flex-col items-center">
        <div class="absolute right-2 top-2">
          <button @click="showExplanation = false" class="px-2 text-2xl bg-transparent text-green-darker">x</button>
        </div>

        <div v-if="explanationType === 'small'">
          <strong>Exempel på liten frukost</strong>

          <ul>
            <li>1 liten skål med fil/ yoghurt/ mjölk</li>
            <li>lite musli/ flingor</li>
          </ul>

          <p>eller</p>

          <ul>
            <li>kaffe/ te/ juice</li>
            <li>1 smörgås med smör och pålägg</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 300 kcal</p>
        </div>

        <div v-if="explanationType === 'medium'">
          <strong>Exempel på mellanstor frukost</strong>

          <ul>
            <li>1 skål yoghurt/ fil/ mjölk</li>
            <li>musli/ flingor</li>
            <li>juice</li>
            <li>1 ägg eller 1 smörgås</li>
          </ul>

          <p>eller</p>

          <ul>
            <li>1 skål gröt med sylt och mjölk</li>
            <li>juice</li>
            <li>ägg eller 1 smörgås</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 450 kcal</p>
        </div>

        <div v-if="explanationType === 'large'">
          <strong>Exempel på stor frukost</strong>

          <ul>
            <li>1 skål yoghurt/ fil/ mjölk</li>
            <li>musli/ flingor</li>
            <li>juice</li>
            <li>1 ägg</li>
            <li>1 smörgås</li>
          </ul>

          <p>eller</p>

          <ul>
            <li>1 skål gröt med sylt och mjölk</li>
            <li>juice/ mjölk</li>
            <li>1 ägg</li>
            <li>1 smörgås</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 700 kcal </p>
        </div>
      </div>
    </dialog>

    <ul class="flex flex-col my-0 p-0 gap-y-2">
      <li class="list-none">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('small')">
          <Info class="text-green-dark" />

          <span>Vad är en liten frukost?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewBreakfast"
        :data="{ label: 'Liten frukost', value: 1, icon: BreakfastSmall }"
        :index="0"
        @picked="handleChange(1)"
      />

      <li class="list-none mt-2">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('medium')">
          <Info class="text-green-dark" />

          <span>Vad är en mellanstor frukost?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewBreakfast"
        :data="{ label: 'Mellanstor frukost', value: 2, icon: BreakfastMedium }"
        :index="1"
        @picked="handleChange(2)"
      />

      <li class="list-none mt-2">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('large')">
          <Info class="text-green-dark" />

          <span>Vad är en stor frukost?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewBreakfast"
        :data="{ label: 'Stor frukost', value: 3, icon: BreakfastLarge }"
        :index="2"
        @picked="handleChange(3)"
      />

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewBreakfast"
        :data="{ label: 'Äter inte frukost', value: 0, }"
        :index="3"
        @picked="handleChange(0)"
      />
    </ul>
  </div>
</template>

<style scoped lang="postcss">
.explanation-dialog {
  @apply text-base;
}
.explanation-dialog ul {
  padding-left: 1em;
}
.explanation-dialog :last-child {
  margin-bottom: 0;
}
</style>
