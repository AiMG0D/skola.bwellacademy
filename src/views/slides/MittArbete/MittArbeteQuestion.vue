<script setup lang="ts">
import { computed, inject, onUnmounted, provide, ref, watch } from 'vue';
import colors from '@/colors.json';
import { IonSpinner, useIonRouter } from '@ionic/vue';
import BRadioItem from '@/components/BRadioItem.vue';
import BIconButton from '@/components/BIconButton.vue';
import ArrowDown from '@/components/icons/ArrowDown.vue';
import { useStore } from '@/stores/main';
import { useBackendFetch } from '@/fetch';
import monsterUrl from '/assets/monster/arg.png';

const props = defineProps({
  data: Object,
});

const store = useStore();
const router = useIonRouter();

const colorScheme = inject('colorScheme', 'yellow');
const doNextSlide = inject('nextSlide');
const previousSlide = inject('previousSlide');

const loading = ref(false);

const warningOpen = ref(false);
const questionAnswered = ref(false);

function nextSlide() {
  if (store.profile.factors[props.data.category_id] === undefined) {
    warningOpen.value = true;
  } else {
    const factor = store.profile.factors[props.data.category_id];

    if (factor.status === 'profile.unknown') {
      questionAnswered.value = false;
      warningOpen.value = true;
    } else {
      questionAnswered.value = true;
    }

    if (factor.improve === undefined) {
      warningOpen.value = true;
    }
  }

  if (warningOpen.value) {
    return;
  }

  doNextSlide();
}

function ignoreWarning() {
  warningOpen.value = false;

  doNextSlide();
}

const getProfileValue = (data) => {
  return {
    label: store.getProfileFactor(data.category_id)?.label ?? '',
    value: store.getProfileValue(data.name) ?? null,
  };
};
const selectedOption = ref(getProfileValue(props.data));

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme];
});

const radioColor = computed(() => {
  return {
    purple: colors.purple.darker,
    yellow: colors.yellow.darker,
    green: colors.green.darker,
    blue: colors.blue.darker,
  }[colorScheme];
});

async function sendProfileValue(name, value) {
  loading.value = true;
  const result = await store.setProfileValue(name, value);
  loading.value = false;

  if (result === null) {
    router.replace('/login');
    return;
  }

  selectedOption.value = result;
}

async function sendImproveValue(value) {
  loading.value = true;
  const result = await store.setImproveValue(props.data.category_id, value);
  loading.value = false;

  if (result === null) {
    router.replace('/login');
  }
}

const questionArea = ref(null);
const navigationArea = ref(null);
const pageArea = ref(null);

const scrollButtonVisible = ref(false);

const resizeObserver = new ResizeObserver((entries) => {
  if (navigationArea.value === null) {
    return false;
  }

  const pageHeight = pageArea.value.clientHeight;
  const navHeight = navigationArea.value.clientHeight;
  const areaHeight = questionArea.value.scrollHeight;

  const availableSpace = pageHeight - navHeight;

  scrollButtonVisible.value = areaHeight > availableSpace;
});

watch(questionArea, (el) => {
  if (el === null) {
    return;
  }

  resizeObserver.observe(el);
});

onUnmounted(() => {
  if (questionArea.value === null) {
    return;
  }

  resizeObserver.unobserve(questionArea.value);
});

function scroll() {
  if (questionArea.value === null) {
    return;
  }

  questionArea.value.scrollTop += 300;
}

provide('questionData', props.data);
</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col" ref="pageArea">
    <div v-if="warningOpen" class="absolute z-10 w-full h-full bg-black/30"></div>

    <dialog :open="warningOpen" class="bg-yellow-light border-none rounded-md shadow-2xl z-50 mt-8 mx-8">
      <div class="flex flex-col items-center">
        <img :src="monsterUrl" alt="" class="monster-img">
        <p class="text-base leading-relaxed" v-if="!questionAnswered">Stopp nu! Du har inte svarat på frågan.</p>
        <p class="text-base leading-relaxed" v-else>Stopp nu! Du har inte svarat om du är nöjd eller vill förbättra.</p>
        <div class="flex gap-x-2">
          <b-button @click="warningOpen = false" look="secondary">Stäng</b-button>
          <b-button @click="ignoreWarning">Gå vidare ändå</b-button>
        </div>
      </div>
    </dialog>

    <div class="overflow-y-scroll scroll-smooth" ref="questionArea">
      <div class="px-8 text-[#171717]">
        <div class="flex items-center gap-x-4">
          <h2 class="font-light text-[25px] mt-8 mb-2" v-text="data.label"></h2>
          <!-- <ion-spinner class="mt-4" v-show="loading" /> -->
        </div>
        <p class="text-lg mt-2 mb-4" v-text="data.description"></p>
      </div>

      <div class="px-8 grow relative">
        <ul class="flex flex-col m-0 p-0 gap-y-2">
          <b-radio-item
            :color-scheme="colorScheme"
            :name="data.name"
            :data="answer"
            :index="idx"
            v-for="(answer, idx) in data.data"
            @picked="sendProfileValue(data.name, answer.value)"
            @improve="(e) => sendImproveValue(e)"
            :expand="true"
          />
        </ul>
      </div>
    </div>

    <div class="mt-auto px-8 pt-10 pb-8 button-border relative" ref="navigationArea">
      <div class="absolute -top-6 right-2" v-if="scrollButtonVisible">
        <b-icon-button @click="scroll"><arrow-down /></b-icon-button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
        <b-button @click="nextSlide">Nästa</b-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.button-border {
  box-shadow: 0px -0.5px 2px 0px rgba(0, 0, 0, 0.25);
}
</style>
