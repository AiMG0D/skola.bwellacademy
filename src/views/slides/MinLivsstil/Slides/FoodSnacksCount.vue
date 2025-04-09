<script setup lang="ts">
import BRadioItem from '@/components/BRadioItem.vue';
import SnacksLeft from '@/components/food-illustrations/SnacksLeft.vue';
import SnacksMiddle from '@/components/food-illustrations/SnacksMiddle.vue';
import SnacksRight from '@/components/food-illustrations/SnacksRight.vue';
import { useStore } from '@/stores/main';
import { useDebounceFn } from '@vueuse/core';

const store = useStore();

const name = 'energyIntakeNewSnackCount';

async function handleChange(event) {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  if (value === '') {
    value = '0';
  }
  update(value);
}

const update = useDebounceFn(async (value) => {
  await store.setProfileValue(name, value);
}, 750);

function increment() {
  store.profile.values[name] ??= 0;
  store.profile.values[name] += 1;

  update(store.profile.values[name].toString());
}

function decrement() {
  store.profile.values[name] ??= 0;
  if (store.profile.values[name] - 1 < 0) {
    return;
  }

  store.profile.values[name] -= 1;

  update(store.profile.values[name].toString());
}
</script>

<template>
  <div class="px-8 mt-8 gap-y-4 w-full">
    <h3 class="m-0 font-light">Mellanmål</h3>

    <p class="text-base mt-1">Hur många gånger per dag äter du mellanmål (inkl. kvällsmål)?</p>

    <p class="text-base mt-1">Klicka fram ditt antal på + eller -</p>

    <div class="bg-white border-green-light border-solid border shadow-md p-4 rounded">
      <div class="flex flex-col justify-between h-full">
        <div class="flex gap-x-3 h-full items-end justify-around mb-6">
          <SnacksLeft />
          <SnacksMiddle />
          <SnacksRight />
        </div>

        <div class="flex justify-around">
          <button type="button" @click="decrement()" class="text-green-darker bg-transparent font-bold text-[30px]">-</button>

          <input
            min="0"
            type="number"
            class="w-10 rounded border-solid border border-green-light shadow text-center"
            id="energyIntakeNewSnackCount"
            name="energyIntakeNewSnackCount"
            @change="handleChange"
            :value="store.profile.values['energyIntakeNewSnackCount']"
          >

          <button type="button" @click="increment()" class="text-green-darker bg-transparent font-bold text-[30px]">+</button>
        </div>
      </div>
    </div>
  </div>
</template>
