<script setup lang="ts">
import {alertController, IonContent, IonIcon, IonLoading, IonPage, modalController, useIonRouter} from '@ionic/vue';
import {arrowBackCircleSharp, settingsSharp} from 'ionicons/icons';
import logoUrl from '/assets/logo.png';
import angryMonsterUrl from '/assets/monster/arg.png';
import {useStore} from '@/stores/main';
import {computed, inject, onMounted, ref} from 'vue';
import {vOnClickOutside} from '@vueuse/components';
import SettingsModal from '@/views/SettingsModal.vue';
import Teamfeeling from '@/components/illustrations/Teamfeeling.vue';
import Goal from '@/components/illustrations/Goal.vue';
import Flag from '@/components/illustrations/Flag.vue';
import Globe from '@/components/illustrations/Globe.vue';
import {featureNotAvailable} from '@/helpers';
import SpeechBubble from '@/components/SpeechBubble.vue';
import {FmsType} from "@/types";

const store = useStore();
const router = useIonRouter();
const fmsType: FmsType = inject('fms-type') as FmsType;

const showDenyMessage = ref(false);
const hasPlan = ref<boolean>(false);

const hasActiveProfile = computed(() => store.profile !== null);

function checkIfDisabled(event) {
  if (event.target.dataset.disabled === 'true') {
    showDenyMessage.value = true;
    return false;
  }

  return true;
}

function goToFirstQuestionPage(event) {
  checkIfDisabled(event);

  if (!hasActiveProfile.value || showDenyMessage.value) {
    return;
  }

  router.navigate('/questions/1', 'forward', 'replace');
}

function goToSecondQuestionPage(event) {
  checkIfDisabled(event);

  if (!hasActiveProfile.value || showDenyMessage.value) {
    return;
  }

  router.replace('/questions/2');
}

function goToGoalsPage(event) {
  checkIfDisabled(event);

  if (!hasActiveProfile.value || showDenyMessage.value) {
    return;
  }

  router.replace('/goals');
}

function goToPlanPage(event) {
  checkIfDisabled(event);

  if (!hasActiveProfile.value || showDenyMessage.value) {
    return;
  }

  if (hasPlan.value) {
    router.replace('/plan/results');
    return;
  }

  router.replace('/plan/prelude');
}

function checkAndToast(event) {
  if (checkIfDisabled(event)) {
    featureNotAvailable();
  }
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex flex-col h-full">
        <header class="pt-6 h-[4.5rem]">
          <div class="grid grid-cols-5">
            <div>
              <button
                class="settings-button w-[1.625rem] h-[1.625rem] text-primary-dark bg-transparent"
                @click="router.navigate('/home', 'back')"
              >
                <ion-icon :icon="arrowBackCircleSharp" class="w-full h-full"></ion-icon>
              </button>
            </div>

            <div class="text-center col-span-3">
              <img :src="logoUrl" class="w-[78px]">
            </div>
          </div>
        </header>

        <main class="mt-4 pb-8">
          <div class="text-[#171717]">
            <h1 class="font-light text-center text-primary-dark">Din personliga Livsstilsplan - bara för dig! </h1>
            <p class="m-0 leading-normal">
              Bwell ger dig en personlig Livsstilsplan som hjälper dig att bestämma hur du vill ha ditt fysiska, mentala och sociala liv.
              <template v-if="fmsType === FmsType.Work">
                För att må bra på jobbet och i livet!
              </template>
              <template v-else>
                För att må bra på skolan och i livet!
              </template>
            </p>
            <p class="leading-none">OBS! Det är bara du som kan se dina resultat.</p>
            <p class="leading-none" v-if="fmsType === FmsType.Work">Klicka nu på ruta 1 <strong>Mitt arbete</strong> så kör vi!</p>
            <p class="leading-none" v-else>Klicka nu på ruta 1 <strong>Min skolgång</strong> så kör vi!</p>
          </div>

          <div class="relative">
            <Transition name="deny">
              <div
                class="w-full h-[325px] bg-[#F9FDF2]/[0.98] absolute z-10 rounded-lg shadow-xl top-[2.5rem] flex justify-center items-center text-center"
                v-if="showDenyMessage"
                v-on-click-outside="() => showDenyMessage = false"
              >
                <div class="absolute w-[95%] -z-10 -left-[3rem] -bottom-0 pointer-events-none">
                  <img :src="angryMonsterUrl" class="w-full h-auto pointer-events-none">
                </div>

                <div class="relative -top-[9rem]">
                  <speech-bubble color="purple" class="absolute w-[150px] scale-x-[-1]">
                    <div class="text-[28px] font-light leading-[1.1em] scale-x-[-1] pt-10 pl-4 pr-4 pb-4">
                      Försöker du fuska va?<br>Gör klart nivå 1 och 2 först!
                    </div>
                  </speech-bubble>
                </div>
              </div>
            </Transition>

            <div class="grid grid-cols-2 gap-4 mt-7 justify-items-center">
              <b-start-button color="yellow" :number="1" @click="goToFirstQuestionPage">
                <template #icon>
                  <Teamfeeling class="mt-[12px] ml-4 mb-2" />
                </template>

                <template v-if="fmsType === FmsType.Work">Mitt arbete</template>
                <template v-else>Min skolgång</template>
              </b-start-button>

              <b-start-button color="green" :number="2" @click="goToSecondQuestionPage">
                <template #icon>
                  <Globe class="mt-3 mb-2" />
                </template>

                Min livsstil
              </b-start-button>

              <b-start-button color="blue" :number="3" :disabled="!store.hasAnyValues()" @click="goToGoalsPage">
                <template #icon>
                  <Flag class="mt-2 ml-4 mb-2" />
                </template>

                Mina mål
              </b-start-button>

              <b-start-button color="yellow" :number="4" :disabled="!store.hasAnyValues()" @click="goToPlanPage">
                <template #icon>
                  <Goal class="mt-2 mb-2" />
                </template>

                Min livsstilsplan
              </b-start-button>

              <!-- <b-start-button color="purple" :number="5" :disabled="true" @click="checkAndToast">
                <template #icon>
                  <Followup class="mt-4" />
                </template>

                Min uppföljning
              </b-start-button> -->
            </div>
          </div>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: theme('colors.primary.background');
  --padding-start: 2rem;
  --padding-end: var(--padding-start);
}
.deny-enter-active {
  animation: deny-in 0.3s;
}
.deny-leave-active {
  animation: deny-out 0.3s;
}
@keyframes deny-in {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.10);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes deny-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.85);
  }
}
</style>
