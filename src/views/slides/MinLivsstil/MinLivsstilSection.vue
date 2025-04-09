<script setup lang="ts">
import Fitness from "@/views/slides/MinLivsstil/Slides/Fitness.vue";
import FitnessPrelude from "@/views/slides/MinLivsstil/Slides/FitnessPrelude.vue";
import { computed, inject, nextTick, onUnmounted, provide, ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { IonicSlides } from '@ionic/vue';
import { useStore } from '@/stores/main';
import BIconButton from '@/components/BIconButton.vue';
import ArrowDown from '@/components/icons/ArrowDown.vue';
import Question from './Slides/Question.vue';
import PhysicalPrelude from './Slides/PhysicalPrelude.vue';
import PhysicalStrengthResults from "@/views/slides/MinLivsstil/Slides/PhysicalStrengthResults.vue";
import PhysicalEpilogue from './Slides/PhysicalEpilogue.vue';
import KasamPrelude from './Slides/KasamPrelude.vue';
import BuddySlide from './Slides/BuddySlide.vue';
import BuddyAlcoholSlide from './Slides/BuddyAlcoholSlide.vue';
import BuddyEnergySlide from './Slides/BuddyEnergySlide.vue';
import FoodBreakfast from './Slides/FoodBreakfast.vue';
import FoodLunch from './Slides/FoodLunch.vue';
import FoodDinner from './Slides/FoodDinner.vue';
import FoodSnacks from './Slides/FoodSnacks.vue';
import FoodSnacksCount from './Slides/FoodSnacksCount.vue';
import PhysicalResults from './Slides/PhysicalResults.vue';
import monsterUrl from '/assets/monster/arg.png';

const props = defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'index', value: number): void;
}>();

const store = useStore();

const colorScheme = inject('colorScheme', 'green');
const nextSectionSlide = inject('nextSlide');
const previousSectionSlide = inject('previousSlide');
const { shouldResetNavigation, setNavigationReset } = inject('shouldResetNavigation');
// const recalculateHeight = inject('recalculateHeight');
const parentHeight = inject('parentHeight');

const warningOpen = ref(false);
const questionAnswered = ref(false);
const canSkip = ref(true);

const slides = ref();
function setSliderInstance(swiper: any) {
  slides.value = swiper;
}

const swiperModules = [IonicSlides];

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

watch(shouldResetNavigation, async (newValue) => {
  if (!newValue) {
    return;
  }

  slides.value.activeIndex = 0;

  await nextTick();
  setNavigationReset();

  // await nextTick();
  // recalculateHeight(slides.value);
});

function nextSlide() {
  const group = props.data.groups[slides.value.activeIndex];

  canSkip.value = true;

  if (group.type === 'food-snack') {
    const count = store.profile.values['energyIntakeNewSnackCount'] ?? 0;

    for (let i = 1; i<= count; i++) {
      const value = store.profile.values[`energyIntakeNewSnack${i}`];

      if (!value) {
        questionAnswered.value = false;
        warningOpen.value = true;
        canSkip.value = false;
        break;
      }
    }
  }

  if (group.questions?.length > 0) {
    if (store.profile.factors[group.category_id] == null) {
      if(group.questions[0].type === 'twovalues') {
        group.questions[0].name.split(',').forEach((part: string) => {
          if (store.getProfileValue(part) === null) {
            warningOpen.value = true;
          }
        });
      } else if(group.improve_name === 'fitMethod') {
        if (!store.profile.factors[4]?.value) {
          questionAnswered.value = false;
          warningOpen.value = true;
        } else if(store.profile.factors[4]?.improve === undefined) {
          questionAnswered.value = true;
          warningOpen.value = true;
        }
      } else {
        if (store.getProfileValue(group.questions[0].name) === null) {
          warningOpen.value = true;
        }
      }
    } else {
      const factor = store.profile.factors[group.category_id];

      if (group.questions?.length > 1) {
        const numQuestionsAnswered = group.questions
          ?.map((question) => store.getProfileValue(question.name) !== null)
          .reduce((acc, v) => v ? acc + 1 : acc, 0) ?? 0;

        if (numQuestionsAnswered !== group.questions?.length) {
          questionAnswered.value = false;
          warningOpen.value = true;
        } else {
          questionAnswered.value = true;
        }
      } else {
        if (factor.status === 'profile.unknown') {
          questionAnswered.value = false;
          warningOpen.value = true;
        } else {
          questionAnswered.value = true;
        }
      }

      if ((typeof group.can_improve != null && group.can_improve) && (factor.improve == null || factor.improve === '0')) {
        warningOpen.value = true;
      }
    }
  }

  if (warningOpen.value) {
    return;
  }

  if (slides.value?.isEnd) {
    nextSectionSlide();
    return;
  }

  slides.value.$el[0].swiper.slideNext();
  questionAnswered.value = false;
}

function previousSlide() {
  if (warningOpen.value) {
    return;
  }

  if (slides.value?.isBeginning) {
    previousSectionSlide();
    return;
  }

  slides.value.$el[0].swiper.slidePrev();
  questionAnswered.value = false;
}

function slideTo(index: number) {
  if (warningOpen.value) {
    return;
  }

  slides.value.$el[0].swiper.slideTo(index);
  questionAnswered.value = false;
}

function ignoreWarning() {
  warningOpen.value = false;

  if (slides.value?.isEnd) {
    nextSectionSlide();
    return;
  }

  slides.value.$el[0].swiper.slideNext();
}

function slideChange(swiper: any) {
  store.savePoints ??= {}
  store.savePoints.life ??= {};

  const index = swiper.activeIndex;

  store.savePoints.life.question = index;

  emit('index', index);

  // Update the wrapper height to prevent overscroll
  recalculateHeight(swiper.params.speed * 0.95);
}

function handleSaved(group) {
  recalculateHeight();
}

function handleUpdate() {
  recalculateHeight(0);
}

function handleResizeRequest() {
  handleUpdate();
}

function skipSection() {
  nextSectionSlide();
}

function canSkipSection() {
  const group = props.data;
  const index = slides.value?.activeIndex ?? 0;
  return (props.data.pageName === 'kasam' || props.data.pageName === 'physical') && index === 0;
}

const questionArea = ref(null);
const navigationArea = ref(null);

const scrollButtonVisible = ref(false);

const resizeObserver = new ResizeObserver(async (entries) => {
  if (navigationArea.value === null) {
    return;
  }

  await recalculateHeight(0);
});

async function recalculateHeight(timeout) {
  slides.value.wrapperEl.style.height = null;
  await nextTick();

  const height = slides.value.slides[slides.value.activeIndex]?.scrollHeight || 0;
  const scrollAreaHeight = parentHeight.value - navigationArea.value.clientHeight;

  setTimeout(() => slides.value.wrapperEl.style.height = `${height}px`, timeout);

  scrollButtonVisible.value = height > scrollAreaHeight;
}

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

const shouldScroll = ref(false);

provide('shouldScroll', {
  shouldScroll,
  scrollDown() {
    shouldScroll.value = true;
  },
  resetShouldScroll() {
    shouldScroll.value = false;
  },
});

watch(shouldScroll, function (value) {
  if (! value) {
    return;
  }

  questionArea.value.scrollTop += 300;

  shouldScroll.value = false;
});

provide('questionData', props.data);

defineExpose({
  slideTo
});
</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col overflow-hidden text-left">
    <div v-if="warningOpen" class="absolute z-10 w-full h-full bg-black/30"></div>

    <dialog :open="warningOpen" class="bg-green-light border-none rounded-md shadow-2xl z-[1000] mt-16 mx-8">
      <div class="flex flex-col items-center">
        <img :src="monsterUrl" alt="" class="monster-img">
        <p class="text-base leading-relaxed" v-if="!questionAnswered">Stopp nu! Du har inte svarat på frågan.</p>
        <p class="text-base leading-relaxed" v-else>Stopp nu! Du har inte svarat om du är nöjd eller vill förbättra.</p>
        <div class="flex gap-x-2">
          <b-button @click="warningOpen = false" look="secondary">Tillbaka</b-button>
          <b-button v-if="canSkip" @click="ignoreWarning">Gå vidare ändå</b-button>
        </div>
      </div>
    </dialog>

    <div class="overflow-y-scroll overflow-x-hidden scroll-smooth" ref="questionArea">
      <swiper
        class="lifestyle-swiper"
        :modules="swiperModules"
        :slides-per-view="1"
        :allow-touch-move="false"
        @swiper="setSliderInstance"
        @activeIndexChange="slideChange"
      >
        <template v-for="group in data.groups">
          <swiper-slide>
            <template v-if="props.data.pageName === 'physical'">
              <PhysicalPrelude v-if="group.label === 'prelude'" />
              <PhysicalStrengthResults v-else-if="group.label === 'physical-strength-results'" @update="handleUpdate" />
              <PhysicalEpilogue v-else-if="group.label === 'epilogue'" />
              <FitnessPrelude v-else-if="group.label === 'fitness-instruction'" />
              <Fitness v-else-if="group.improve_name === 'fitMethod'" @update="handleUpdate" />
              <Question v-else :data="group" @saved="handleSaved(group)" @update="handleUpdate" />
            </template>
            <KasamPrelude v-else-if="props.data.pageName === 'kasam' && group.label === 'prelude'" />
            <BuddySlide v-else-if="group.label === 'buddy'" :text="group.value.text" :color="group.value.color" />
            <BuddyAlcoholSlide v-else-if="group.label === 'buddy-alcohol'" />
            <template v-else-if="props.data.pageName === 'energy'">
              <BuddyEnergySlide v-if="group.label === 'buddy-energy'" @resize="handleResizeRequest" />
              <FoodBreakfast v-else-if="group.type === 'food-breakfast'" />
              <FoodLunch v-else-if="group.type === 'food-lunch'" />
              <FoodDinner v-else-if="group.type === 'food-dinner'" />
              <FoodSnacks v-else-if="group.type === 'food-snack'" @resize="handleResizeRequest" />
              <FoodSnacksCount v-else-if="group.type === 'food-snack-count'" />
              <Question v-else :data="group" @saved="handleSaved(group)" @update="handleUpdate" />
            </template>
            <PhysicalResults v-else-if="+group.category_id === 97" @update="handleUpdate" />
            <Question v-else :data="group" @saved="handleSaved(group)" @update="handleUpdate" />
          </swiper-slide>
        </template>
      </swiper>
    </div>

    <div class="mt-auto px-8 pt-10 pb-8 button-border relative z-[9]" ref="navigationArea">
      <div class="absolute -top-6 right-2" v-if="scrollButtonVisible">
        <b-icon-button @click="() => shouldScroll = true"><arrow-down /></b-icon-button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
        <b-button @click="nextSlide">Nästa</b-button>
        <b-button
          look="secondary"
          class="col-span-2"
          @click="skipSection"
          v-if="canSkipSection()"
        >
        Hoppa över testet
      </b-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.swiper-slide {
  text-align: left !important;
  align-items: flex-start !important;
}

.swiper :deep(.swiper-wrapper) {
  align-items: flex-start !important;
}

.monster-img {
  width: 75% !important;
}

.button-border {
  box-shadow: 0px -0.5px 2px 0px rgba(0, 0, 0, 0.25);
}
</style>
