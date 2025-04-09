<script setup lang="ts">
import {FmsType, ProfileValueChange} from '@/types';
import { computed, inject } from 'vue';
import { useStore } from '@/stores/main';
import { useDebounceFn } from '@vueuse/core';
import BeerBottle from '@/components/alcohol-illustrations/BeerBottle.vue';
import BeerGlass from '@/components/alcohol-illustrations/BeerGlass.vue';
import BeerCan from '@/components/alcohol-illustrations/BeerCan.vue';
import WineGlassHalf from '@/components/alcohol-illustrations/WineGlassHalf.vue';
import WineGlassFull from '@/components/alcohol-illustrations/WineGlassFull.vue';
import WineBottle from '@/components/alcohol-illustrations/WineBottle.vue';
import ShotGlass from '@/components/alcohol-illustrations/ShotGlass.vue';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const fmsType: FmsType = inject('fms-type') as  FmsType;

const store = useStore();

const inputs = [
  {
    label: 'Starköl, 33 cl, 5 %',
    image: BeerBottle,
  },
  {
    label: 'Starköl, 50 cl, 5 %',
    image: BeerGlass,
  },
  {
    label: 'Folköl, 50 cl, 2,8 %',
    image: BeerCan,
  },
  {
    label: 'Vin, litet glas, 10 cl, 13 %',
    image: WineGlassHalf,
  },
  {
    label: 'Vin, stort glas, 20 cl, 13 %',
    image: WineGlassFull,
  },
  {
    label: 'Flaska vin, 75 cl, 13 %',
    image: WineBottle,
  },
  {
    label: 'Sprit, 4 cl, 40 %',
    image: ShotGlass,
  },
];

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  let value = target.value;
  if (value === '') {
    value = '0';
  }
  update(target.name, value);
}

const update = useDebounceFn((name, value) => {
  emit('change', { name, value });
}, 1);

function increment(name) {
  store.profile.values[name] ??= 0;
  store.profile.values[name] += 1;

  update(name, store.profile.values[name].toString());
}

function decrement(name) {
  store.profile.values[name] ??= 0;
  if (store.profile.values[name] - 1 < 0) {
    return;
  }

  store.profile.values[name] -= 1;

  update(name, store.profile.values[name].toString());
}

const colorScheme = inject('colorScheme', 'green');
const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme];
});

const alcoholDrinkingValue = computed(() => store.getProfileValue('alcoholDrinking') ?? null);
</script>

<template>
  <div class="text-base mb-4" :data-name="data.name">
    <p class="w-full mt-0 text-base">
      <template v-if="fmsType === 'school'">
        Om du dricker alkohol – Hur mycket dricker du per vecka (helg)?
      </template>
      <template v-else>
        När du dricker alkohol hur ser fördelningen ut en helt vanlig arbetsvecka? (ej semester)
      </template>
    </p>

    <ul :class="borderColor" class="p-0 list-none justify-between border border-solid shadow rounded-lg my-0 gap-y-2 px-3 py-2 bg-white">
      <li>
        <b-radio
          name="alcoholDrinking"
          value="0"
          color="green"
          label="Dricker inte alkohol"
          label-name="alcoholDrink-label"
          @change="$emit('change', { name: 'alcoholDrinking', value: '0' })"
          v-model="alcoholDrinkingValue"
          class="mx-4"
          :vertical="false"
        />
      </li>

      <li>
        <b-radio
          name="alcoholDrinking"
          value="1"
          color="green"
          label="Dricker alkohol"
          label-name="alcoholDrink-label"
          @change="$emit('change', { name: 'alcoholDrinking', value: '1' })"
          v-model="alcoholDrinkingValue"
          class="mx-4"
          :vertical="false"
        />
      </li>
    </ul>

    <div v-if="(store.profile.values['alcoholDrinking'] ?? '0') == '1'">
      <p>Tryck + eller - och välj antal per enhet</p>

      <ul class="flex flex-wrap p-0 list-none gap-x-3 gap-y-4">
        <li v-for="(input, index) in inputs" class="flex items-start">
          <div class="bg-green-light shadow-md p-4 rounded w-[9.25rem] h-[9rem]">
            <div class="flex flex-col justify-between h-full">
              <div class="flex gap-x-3 h-full">
                <label :for="`alcoholDrink${index + 1}`" v-text="input.label" class="pt-4 mr-2 leading-none text-green-darker"></label>

                <div class="mt-auto">
                  <component :is="input.image" />
                </div>
              </div>

              <div class="flex justify-around">
                <button type="button" @click="decrement(`alcoholDrink${index + 1}`)" class="text-green-darker bg-transparent font-bold text-[30px]">-</button>

                <input
                min="0"
                type="number"
                class="w-10 rounded border-solid border border-green-light shadow text-center"
                :id="`alcoholDrink${index + 1}`"
                :name="`alcoholDrink${index + 1}`"
                @change="handleChange"
                :value="store.profile.values[`alcoholDrink${index + 1}`]"
                >

                <button type="button" @click="increment(`alcoholDrink${index + 1}`)" class="text-green-darker bg-transparent font-bold text-[30px]">+</button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
