<script setup lang="ts">
import BRadioItem from '@/components/BRadioItem.vue';
import DinnerLarge from '@/components/food-illustrations/DinnerLarge.vue';
import DinnerMedium from '@/components/food-illustrations/DinnerMedium.vue';
import DinnerSmall from '@/components/food-illustrations/DinnerSmall.vue';
import Info from '@/components/icons/Info.vue';
import {useStore} from '@/stores/main';
import {FmsType} from "@/types";
import {inject, ref} from 'vue';

const fmsType: FmsType = inject('fms-type') as  FmsType;

const store = useStore();

const showExplanation = ref(false);
const explanationType = ref('small');

function openExplanation(type) {
  explanationType.value = type;
  showExplanation.value = true;
}

async function handleChange(value) {
  await store.setProfileValue('energyIntakeNewDinner', value);
}
</script>

<template>
  <div class="px-8 mt-8 gap-y-4 w-full">
    <h3 class="m-0 font-light">Middag</h3>

    <p class="text-base mt-1">Hur ser din middag oftast ser ut. Är den liten mellan eller stor?</p>

    <dialog :open="showExplanation" class="bg-green-light border-none rounded-md shadow-2xl z-50 mt-6 mx-auto explanation-dialog">
      <div class="flex flex-col items-center">
        <div class="absolute right-2 top-2">
          <button @click="showExplanation = false" class="px-2 text-2xl bg-transparent text-green-darker">x</button>
        </div>

        <div v-if="explanationType === 'small'">
          <strong>Exempel på liten middag</strong>

          <p>1 liten sallad med dressing</p>

          <p>eller 1 smörgås &amp; kaffe</p>

          <p class="mb-0">eller liten portion lagad mat:</p>
          <ul class="mt-0">
            <li>ex ½ tallrik grönsaker</li>
            <li>lite pasta/potatis</li>
            <li>kött/fisk/fågel</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 300 kcal</p>
        </div>

        <div v-if="explanationType === 'medium'">
          <strong>Exempel på mellanstor middag</strong>

          <p>1 sallad med dressing, bröd &amp; mjölk/<br>annan dryck (ej vatten)</p>

          <p class="mb-0">eller lagad mat:</p>
          <ul class="mt-0">
            <li>1/3 tallrik pasta/ potatis/ris</li>
            <li>1/3 grönsaker</li>
            <li>1/3 kött/fisk/fågel</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 450 kcal</p>
        </div>

        <div v-if="explanationType === 'large'">
          <strong>Exempel på stor middag</strong>

          <p>1 matig sallad med bröd, smör, mjölk/<br>annan dryck (ej vatten)</p>

          <p class="mb-0">eller en portion lagad mat:</p>
          <ul class="mt-0">
            <li>ex ½ tallrik pasta/ris/potatis</li>
            <li>kött/fisk/fågel</li>
            <li>sås</li>
            <li>mjölk</li>
          </ul>

          <p v-if="fmsType === FmsType.Work">ca 700 kcal </p>
        </div>
      </div>
    </dialog>

    <ul class="flex flex-col my-0 p-0 gap-y-2">
      <li class="list-none">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('small')">
          <Info class="text-green-dark" />

          <span>Vad är en liten middag?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewDinner"
        :data="{ label: 'Liten middag', value: 1, icon: DinnerSmall }"
        :index="0"
        @picked="handleChange(1)"
      />

      <li class="list-none mt-2">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('medium')">
          <Info class="text-green-dark" />

          <span>Vad är en mellanstor middag?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewDinner"
        :data="{ label: 'Mellanstor middag', value: 2, icon: DinnerMedium }"
        :index="1"
        @picked="handleChange(2)"
      />

      <li class="list-none mt-2">
        <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('large')">
          <Info class="text-green-dark" />

          <span>Vad är en stor middag?</span>
        </button>
      </li>

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewDinner"
        :data="{ label: 'Stor middag', value: 3, icon: DinnerLarge }"
        :index="2"
        @picked="handleChange(3)"
      />

      <b-radio-item
        class="text-base"
        color-scheme="green"
        name="energyIntakeNewDinner"
        :data="{ label: 'Äter inte middag', value: 0, }"
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
