<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { IonContent, IonIcon, IonLoading, IonFab, IonFabButton, IonicSlides, IonPage, useIonRouter } from '@ionic/vue';
import { useStore as useMainStore } from '@/stores/main';
import { useStore as usePagesStore } from '@/stores/pages';
import {computed, nextTick, onBeforeUpdate, onMounted, onUnmounted, provide, ref} from 'vue';
import { homeSharp } from 'ionicons/icons';
import { useBackendFetch } from '@/fetch';
import MinLivsstilStart from '@/views/slides/MinLivsstil/MinLivsstilStart.vue';
import MinLivsstilEnd from '@/views/slides/MinLivsstil/MinLivsstilEnd.vue';
import MinLivsstilSection from '@/views/slides/MinLivsstil/MinLivsstilSection.vue';
import MinLivsstilHeader from '@/views/slides/MinLivsstil/MinLivsstilHeader.vue';
import MinLivsstilResults from '@/views/slides/MinLivsstil/MinLivsstilResults.vue';

const mainStore = useMainStore();
const pagesStore = usePagesStore();

const router = useIonRouter();

const props = defineProps({
  page: Number,
});

const slides = ref();
function setSliderInstance(swiper: any) {
  slides.value = swiper;
}

const shouldResetNavigation = ref(false);

const sections = ref([]);

const windowHeight = ref(window.innerWidth <= 445 ? window.innerHeight : 844);

const updateWindowHeight = () => {
  windowHeight.value = window.innerWidth <= 445 ? window.innerHeight : 844;
};

onMounted(async () => {
  window.addEventListener('resize', updateWindowHeight, { passive: true });

  const { data, statusCode } = await useBackendFetch('/questions/life').get().json();

  if (statusCode.value === 401) {
    mainStore.logout();
    router.replace('/login');
    return;
  }

  sections.value = data.value.sections;

  const save = mainStore.savePoints?.life;
  if (save == null) {
    mainStore.savePoints ??= {};
    mainStore.savePoints.life ??= {};
    mainStore.savePoints.life.page = 0;
    mainStore.savePoints.life.question = 0;
  } else {
    // slides.value.activeIndex = save.page;
  }

  await nextTick();
  recalculateHeight(slides.value);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowHeight, { passive: true });
});

const currentSectionIdx = computed(() => slides.value?.activeIndex ?? 0);
const currentSection = computed(() => {
  const idx = currentSectionIdx.value - 1;
  return (idx < 0 || idx >= sections.value.length) ? null : sections.value[idx];
});

const swiperModules = [IonicSlides];

const questionIndex = ref(1);
const updateQuestionIndex = (idx) => questionIndex.value = idx + 1;

async function nextSlide() {
  mainStore.savePoints ??= {}
  mainStore.savePoints.life ??= {};

  mainStore.savePoints.life.page = currentSectionIdx.value + 1;
  mainStore.savePoints.life.question = 0;

  slides.value.$el[0].swiper.slideNext();
  questionIndex.value = 1;
  shouldResetNavigation.value = true;

  // await nextTick();
  recalculateHeight(slides.value, slides.value.params.speed);
}

async function previousSlide() {
  mainStore.savePoints ??= {}
  mainStore.savePoints.life ??= {};

  mainStore.savePoints.life.page = currentSectionIdx.value - 1;
  mainStore.savePoints.life.question = 0;

  slides.value.$el[0].swiper.slidePrev();
  questionIndex.value = 1;
  shouldResetNavigation.value = true;

  // await nextTick();
  recalculateHeight(slides.value, slides.value.params.speed);
}

function setSection(idx) {
  mainStore.savePoints ??= {}
  mainStore.savePoints.life ??= {};

  mainStore.savePoints.life.page = idx;
  mainStore.savePoints.life.question = 0;

  slides.value.$el[0].swiper.slideTo(idx);
  questionIndex.value = 1;
  shouldResetNavigation.value = true;
}

function goToNextPage() {
  mainStore.savePoints ??= {}
  mainStore.savePoints.life ??= {};

  mainStore.savePoints.life.page = 0;
  mainStore.savePoints.life.question = 0;

  router.navigate(`/questions/${props.page + 1}`)
};

const fullHeight = computed(() => {
  const headerHeight = (slides.value?.activeIndex ?? 0) > 0 ? 172 : 112;
  return windowHeight.value - headerHeight;
});

async function recalculateHeight(swiper, timeout: number = 0) {
  swiper.wrapperEl.style.height = null;
  // await nextTick();

  // const headerHeight = (swiper?.activeIndex ?? 0) > 0 ? 172 : 112;
  // const fullContentHeight = fullHeight.value - headerHeight;

  // const nextHeight = swiper.slides[swiper.activeIndex].clientHeight;

  setTimeout(() => swiper.wrapperEl.style.height = `${fullHeight.value}px`, timeout);
}

const goHome = () => router.replace('/evaluate');

const questionAreaHeight = computed(function () {
  return slides.value.slides[slides.value.activeIndex].clientHeight;
});

let sectionElements: any[] = [];
function setSectionRef(el: any) {
  if (sectionElements.indexOf(el) < 0) {
    sectionElements.push(el);
  }
}

function onHeaderSlide(e: any) {
  sectionElements[slides.value.activeIndex - 1].slideTo(e - 1);
}

provide('currentSection', currentSection);
provide('colorScheme', 'green');
provide('nextSlide', nextSlide);
provide('previousSlide', previousSlide);
provide('setSection', setSection);
provide('goHome', goHome);
provide('goToNextPage', goToNextPage);
provide('shouldResetNavigation', {
  shouldResetNavigation,
  setNavigationReset() {
    shouldResetNavigation.value = false;
  },
});
provide('recalculateHeight', recalculateHeight);
provide('parentHeight', fullHeight);
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-fab slot="fixed">
        <ion-fab-button @click="goHome">
          <ion-icon :icon="homeSharp" />
        </ion-fab-button>
      </ion-fab>

      <ion-loading
        :is-open="sections.length === 0"
        message="Laddar frågor..."
      />

      <min-livsstil-header
        :current-section-idx="currentSectionIdx"
        :current-page-idx="questionIndex"
        :question-count="currentSection?.groups.length ?? 1"
        :sections="sections"
        :show-progress="currentSectionIdx <= sections.length"
        :is-results-page="currentSectionIdx > (sections.length + 1)"
        @slide="onHeaderSlide"
      />

      <swiper
        :modules="swiperModules"
        :slides-per-view="1"
        :allow-touch-move="false"
        :style="{height:`${fullHeight}px`}"
        @swiper="setSliderInstance"
        data-fuck="off"
      >
        <swiper-slide>
          <MinLivsstilStart :sections="sections" />
        </swiper-slide>

        <swiper-slide class="overflow-y-scroll" :style="{height:`${fullHeight}px`}" v-for="section in sections">
          <MinLivsstilSection :data="section" @index="updateQuestionIndex" :ref="setSectionRef" />
        </swiper-slide>

        <swiper-slide>
          <MinLivsstilEnd />
        </swiper-slide>

        <swiper-slide>
          <min-livsstil-results :sections="sections" />
        </swiper-slide>
      </swiper>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-fab {
  right: 0.5rem;
  top: 130px;
}
ion-content {
  --keyboard-offset: 0 !important;
}
.swiper .swiper-slide {
  align-items: start;
  text-align: left;
}
</style>
