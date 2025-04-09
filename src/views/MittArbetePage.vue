<script setup lang="ts">
import BSlideHeader from '@/components/BSlideHeader.vue';
import {useBackendFetch} from '@/fetch';
import {useStore as useMainStore} from '@/stores/main';
import {useStore as usePagesStore} from '@/stores/pages';
import {FmsType} from "@/types";
import MittArbeteHeader from '@/views/slides/MittArbete/MittArbeteHeader.vue';
import MittArbeteResults from '@/views/slides/MittArbete/MittArbeteResults.vue';
import {
  alertController,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonicSlides,
  IonLoading,
  IonPage,
  useIonRouter
} from '@ionic/vue';
import '@ionic/vue/css/ionic-swiper.css';
import {homeSharp} from 'ionicons/icons';
import 'swiper/css';
import 'swiper/css/pagination';
import {Swiper, SwiperSlide} from 'swiper/vue';
import {computed, inject, nextTick, onMounted, provide, ref} from 'vue';

const mainStore = useMainStore();
const pagesStore = usePagesStore();

const router = useIonRouter();

const props = defineProps<{
  page: number;
}>();

const slides = ref();
const startingSlide = ref(0);
const currentSlideIdx = computed(() => slides.value?.activeIndex ?? startingSlide.value);
const pageData = pagesStore.pages[props.page - 1];
const questions = ref([]);
const isLoadingQuestions = ref(false);
const loadingAnswers = ref(true);
const fmsType: FmsType = inject('fms-type') as FmsType;

function setSliderInstance(swiper: any) {
  slides.value = swiper;
}

const presentAlert = async (header: string, message: null|string = null, buttonText = 'Okej') => {
  await new Promise(async r => {
    const alert = await alertController.create({
      header,
      message,
      buttons: [{
        text: buttonText,
        role: 'confirm',
        handler: () => {
          r(true);
        },
      }],
    });

    await alert.present();
  });
};

onMounted(async () => {
  isLoadingQuestions.value = true;

  const url = fmsType === FmsType.Work ? '/questions/work' : '/questions/school';
  const { data, statusCode } = await useBackendFetch(url).get().json();

  isLoadingQuestions.value = false;

  if (statusCode.value === 401) {
    await presentAlert('Du har loggats ut!');

    mainStore.logout();
    router.replace('/login');
    return;
  }

  if (statusCode.value === null || statusCode.value >= 400) {
    await presentAlert('Ett fel uppstod!', 'Var vänlig försök igen om en liten stund. Kontakta support ifall problemet kvarstår.');

    router.replace('/evaluate');

    return;
  }

  questions.value = data.value.groups[0].questions;

  const save = mainStore.savePoints?.work;
  if (save === null) {
    mainStore.savePoints ??= {};
    mainStore.savePoints.work = 0;
    return;
  }

  startingSlide.value = save;
  slides.value.activeIndex = save;
});

const swiperModules = [IonicSlides];

const swiperHeight = computed(() => {
  if (currentSlideIdx.value > 0) {
    return pageData.headerHeightClass ?? 'h-[calc(100%-156px)]';
  } else {
    return 'h-[calc(100%-112px)]';
  }
});

const headerComponent = pageData.header ?? BSlideHeader;

const goHome = () => router.replace('/evaluate');
const goToNextPage = () => {
  mainStore.savePoints ??= {}
  mainStore.savePoints.work = 0;

  router.navigate(`/questions/${props.page + 1}`)
};
const nextSlide = async () => {
  if (currentSlideIdx.value === slides.value?.slides.length - 1) {
    goToNextPage();
    return;
  }

  mainStore.savePoints ??= {}
  mainStore.savePoints.work = currentSlideIdx.value + 1;

  slides.value.$el[0].swiper.slideNext();
  await nextTick();
  slides.value.$el[0].scrollTop = 0;
}
const previousSlide = () => {
  mainStore.savePoints ??= {}
  mainStore.savePoints.work = currentSlideIdx.value - 1;

  slides.value.$el[0].swiper.slidePrev();
}

function onHeaderSlide(e: any) {
  slides.value.$el[0].swiper.slideTo(e);
}

provide('pageData', pageData);
provide('colorScheme', pageData.color);
provide('nextSlide', nextSlide);
provide('previousSlide', previousSlide);
provide('goHome', goHome);
provide('goToNextPage', goToNextPage);
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
        :is-open="isLoadingQuestions"
        message="Laddar frågor..."
      />

      <!-- <ion-loading
        :is-open="loadingAnswers"
        message="Laddar svar..."
      /> -->

      <mitt-arbete-header
        :current-slide-idx="currentSlideIdx"
        :question-count="questions.length"
        :show-progress="currentSlideIdx <= questions.length"
        :is-results-page="currentSlideIdx === questions.length + 1"
        @slide="onHeaderSlide"
      />

      <swiper
        :modules="swiperModules"
        :class="[swiperHeight, currentSlideIdx === 0 ? 'overflow-y-auto' : null]"
        :slides-per-view="1"
        :allow-touch-move="false"
        @swiper="setSliderInstance"
      >
        <swiper-slide class="h-[calc(100%-112px)]">
          <component :is="pageData.start" />
        </swiper-slide>

        <swiper-slide class="min-h-[calc(100%-156px)] overflow-auto" v-for="question in questions">
          <component :is="pageData.question" :data="question" />
        </swiper-slide>

        <swiper-slide class="h-[calc(100%-156px)]">
          <mitt-arbete-results :questions="questions" />
        </swiper-slide>

        <swiper-slide class="h-[calc(100%-156px)]">
          <component :is="pageData.end" />
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
