<script setup lang="ts">
import {FmsType} from "@/types";
import { IonIcon } from '@ionic/vue';
import BDetails from '@/components/BDetails.vue';
import BRadioItem from '@/components/BRadioItem.vue';
import SnacksSmall from '@/components/food-illustrations/SnacksSmall.vue';
import SnacksMedium from '@/components/food-illustrations/SnacksMedium.vue';
import SnacksLarge from '@/components/food-illustrations/SnacksLarge.vue';
import Info from '@/components/icons/Info.vue';
import { useStore } from '@/stores/main';
import {checkmark, checkmarkCircleOutline} from "ionicons/icons";
import { inject, computed, ref } from 'vue';

const fmsType: FmsType = inject('fms-type') as  FmsType;

const store = useStore();

defineEmits<{
  (e: 'resize'): void;
}>();

const count = computed(() => store.profile.values['energyIntakeNewSnackCount'] ?? 0);

const showExplanation = ref(false);
const explanationType = ref('small');

function openExplanation(type) {
  explanationType.value = type;
  showExplanation.value = true;
}

async function handleChange(idx, value) {
  await store.setProfileValue(`energyIntakeNewSnack${idx}`, value);
}

const answered = computed(() => {
  const result = [];

  for(let i = 1; i <= count.value; i++) {
    result.push(!!store.getProfileValue(`energyIntakeNewSnack${i}`))
  }

  return result;
})
</script>

<template>
  <div class="px-8 mt-8 pb-8 gap-y-4 w-full min-h-[560px]">
    <h3 class="m-0 font-light">Mellanmål</h3>

    <template v-if="count > 0">
      <p class="text-base mt-1">Här är alla dina mellanmål du äter per dag. Gå in och välj storlek på dina mellanmål (räkna in ev kvällsmål)</p>

      <dialog
        :open="showExplanation"
        class="bg-green-light border-none rounded-md shadow-2xl z-50 mt-6 mx-auto explanation-dialog"
      >
        <div class="flex flex-col items-center">
          <div class="absolute right-2 top-2">
            <button @click="showExplanation = false" class="px-2 text-2xl bg-transparent text-green-darker">x</button>
          </div>

          <div v-if="explanationType === 'small'">
            <strong>Exempel på litet mellanmål</strong>

            <p>
              1 frukt<br>
              eller ett par riskakor eller ett glas juice/ mjölk/ annan dryck (ej vatten)<br>
              eller högst 2hg godis/ fika/ snacks<br>
              eller 2-4 hg godis/ fika/ snacks<br>
            </p>

            <p v-if="fmsType === FmsType.Work">ca 150 kcal</p>
          </div>

          <div v-if="explanationType === 'medium'">
            <strong>Exempel på mellanstort mellanmål</strong>

            <p>
              1 mjuk smörgås med pålägg + juice/ mjölk<br><br>

              eller 2 knäckebröd med smör och pålägg<br>
              + juice/ mjölk eller en skål fil/ yoghurt/ mjölk, musli/ flingor<br><br>

              eller 2-4 hg godis/ fika/ snacks
            </p>

            <p v-if="fmsType === FmsType.Work">ca 450 kcal</p>
          </div>

          <div v-if="explanationType === 'large'">
            <strong>Exempel på stort mellanmål</strong>

            <ul>
              <li>2 smörgåsar</li>
              <li>mjölk/ juice</li>
              <li>1 frukt alt. 1 ägg</li>
            </ul>

            <p>eller</p>

            <ul>
              <li>2 knäcke bröd med smör och pålägg</li>
              <li>mjölk/ juice</li>
              <li>en skål fil/ yoghurt/ mjölk, musli/ flingor</li>
            </ul>

            <p>eller högst 4hg godis/ fika/ snacks</p>

            <p v-if="fmsType === FmsType.Work">ca 550 kcal</p>
          </div>
        </div>
      </dialog>

      <div class="flex flex-col gap-y-4">
        <b-details v-for="idx in [...Array(count).keys()]" @toggle="$emit('resize')">
          <template #summary>
            <div class="flex items-center gap-2">
              <span>{{ idx + 1 }}. Mellanmål</span>
              <ion-icon v-if="answered[idx]" :icon="checkmarkCircleOutline" class="text-xl"/>
            </div>
          </template>

          <ul class="flex flex-col my-0 p-0 gap-y-2">
            <li class="list-none">
              <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('small')">
                <Info class="text-green-dark" />

                <span>Vad är ett litet mellanmål?</span>
              </button>
            </li>

            <b-radio-item
              class="text-base"
              color-scheme="green"
              :name="`energyIntakeNewSnack${idx + 1}`"
              :data="{ label: 'Litet mellanmål', value: 1, icon: SnacksSmall }"
              :index="0"
              @picked="handleChange(idx + 1, 1)"
            />

            <li class="list-none mt-2">
              <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('medium')">
                <Info class="text-green-dark" />

                <span>Vad är ett mellanstort mellanmål?</span>
              </button>
            </li>

            <b-radio-item
              class="text-base"
              color-scheme="green"
              :name="`energyIntakeNewSnack${idx + 1}`"
              :data="{ label: 'Mellanstort mellanmål', value: 2, icon: SnacksMedium }"
              :index="1"
              @picked="handleChange(idx + 1, 2)"
            />

            <li class="list-none mt-2">
              <button class="flex items-center text-base gap-x-1 bg-transparent" @click="openExplanation('large')">
                <Info class="text-green-dark" />

                <span>Vad är ett stort mellanmål?</span>
              </button>
            </li>

            <b-radio-item
              class="text-base"
              color-scheme="green"
              :name="`energyIntakeNewSnack${idx + 1}`"
              :data="{ label: 'Stort mellanmål', value: 3, icon: SnacksLarge }"
              :index="2"
              @picked="handleChange(idx + 1, 3)"
            />
          </ul>
        </b-details>
      </div>
    </template>
    <template v-else>
      <p class="text-base mt-1">Du har valt att du inte äter några mellanmål.</p>
    </template>
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
