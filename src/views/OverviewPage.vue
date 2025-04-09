<script setup lang="ts">
import {useStore} from "@/stores/main";
import PlanModal from "@/views/Overview/PlanModal.vue";
import SettingsModal from "@/views/SettingsModal.vue";
import {alertController, IonContent, IonIcon, IonLoading, IonPage, loadingController, modalController} from '@ionic/vue';
import { useIonRouter } from '@ionic/vue';
import logoUrl from '/assets/logo.png';
import monsterUrl from '/assets/monster/vinka.png';
import {arrowDownCircleOutline, informationCircleOutline, settingsSharp} from "ionicons/icons";
import {computed, ref} from 'vue';
import SpeechBubble from '@/components/SpeechBubble.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';

const router = useIonRouter();
const store = useStore();

const hasActiveProfile = computed(() => store.profile !== null);
const hasCompletedProfiles = computed(() => store.profiles.length > 0);
const showAllProfiles = ref(false);

async function openSettingsModal() {
  const modal = await modalController.create({
    component: SettingsModal,
  });
  await modal.present();
}

const fetchingNewPlan = ref(false);

async function newPlan() {
  fetchingNewPlan.value = true;
  await store.getNewPlan();
  fetchingNewPlan.value = false;

  setTimeout(() => router.replace('/evaluate'), 500);
}

async function showProfile(profileId: number) {
  const profile = store.profiles.filter(p => p.id === profileId)[0];

  const loading = await loadingController.create({
    message: 'Hämtar plan...',
  });

  await loading.present();

  const plan = await store.fetchPlanById(profileId);

  await loading.dismiss();

  if (!plan.goals) {
    const alert = await alertController.create({
      header: 'Åh nej!',
      message: 'Ett fel uppstod när din plan skulle hämtas. Var vänlig prova igen om en litens stund.',
      buttons: ['Okej'],
    });

    await alert.present();

    return;
  }

  const modal = await modalController.create({
    component: PlanModal,
    componentProps: {
      profile,
      plan,
    },
  });

  await modal.present();
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-loading :is-open="fetchingNewPlan" message="Laddar..." />

      <div class="flex flex-col h-full">
        <header class="pt-6 h-[4.5rem]">
          <div class="grid grid-cols-5">
            <div></div>

            <div class="text-center col-span-3">
              <img :src="logoUrl" class="w-[78px]">
            </div>

            <div class="text-right">
              <button
                class="settings-button w-[1.625rem] h-[1.625rem] text-primary-dark bg-transparent"
                @click="openSettingsModal"
              >
                <ion-icon :icon="settingsSharp" class="w-full h-full"></ion-icon>
              </button>
            </div>
          </div>
        </header>

        <main class="mt-4 text-center">
          <div class="flex flex-col flex-shrink overflow-y-auto overflow-x-hidden mb-8">
            <div class="flex flex-col flex-shrink min-h-0">
              <div class="flex-shrink-0 relative top-[25px] -left-[5px]">
                <speech-bubble color="purple" class="w-[65%] -z-5">
                  <div class="w-full h-full flex items-center justify-center pb-14 pt-8 px-6">
                    <div v-if="hasActiveProfile || hasCompletedProfiles">
                      <p class="text-xl m-0">Välkommen tillbaka!</p>
                      <p class="m-0 mt-2" v-if="hasCompletedProfiles">Nedan ser du dina tidigare livsstilsplaner.</p>
                    </div>
                    <div v-else>
                      <p class="text-xl m-0">Välkommen till Bwell!</p>
                      <p class="m-0 mt-2">Klicka på knappen nedan för att komma igång!</p>
                    </div>
                  </div>
                </speech-bubble>
              </div>

              <img class="monster self-center w-4/5 max-w-[16rem] aspect-square flex-shrink -mt-5" :src="monsterUrl">
            </div>
          </div>

          <div v-if="hasActiveProfile" class="mb-8 bg-green-light p-6 rounded-2xl space-y-4">
            <p class="m-0">Kom ihåg att göra färdigt din påbörjade livsstilsplan!</p>
            <b-button @click="router.navigate('/evaluate')" class="!bg-green-darker hover:!bg-green-dark">Fortsätt</b-button>
          </div>

          <div v-if="hasCompletedProfiles" class="mb-8">
            <!--<b-button @click="showPlan(store.profiles[0].id)">Visa min senaste livsstilsplan</b-button>-->
            <ul class="list-none m-0 p-0 w-full text-left border-2 border-solid border-purple-dark divide-y divide-solid divide-purple-dark divide-x-0 rounded-xl overflow-hidden">
              <li>
                <a href="#" class="p-3 flex justify-between items-center no-underline text-white bg-purple-dark hover:bg-purple-darker"  @click.prevent="showProfile(store.profiles[0].id)">
                  <div>
                    <div class="text-lg">Min senaste livsstilsplan</div>
                    <div class="text-sm font-bold">{{ dayjs(store.profiles[0].created_at).locale('sv').format('D MMMM, YYYY') }}</div>
                  </div>
                  <ion-icon :icon="informationCircleOutline" class="text-2xl"/>
                </a>
              </li>
              <template v-if="hasCompletedProfiles && store.profiles.length > 1">
                <li v-if="!showAllProfiles">
                  <a href="#" class="p-3 flex justify-between items-center no-underline text-purple-darker bg-black bg-opacity-[2.5%] hover:bg-opacity-[5%]" @click.prevent="() => showAllProfiles = true">
                    <div>
                      Visa alla mina tidigare livsstilsplaner
                    </div>
                    <ion-icon :icon="arrowDownCircleOutline" class="text-2xl"/>
                  </a>
                </li>
                <template v-else>
                  <template v-for="(profile, index) in store.profiles">
                    <li v-if="index" :key="index" class="[&>*]:odd:bg-opacity-[7.5%] [&>*]:hover:odd:bg-opacity-[10%]">
                      <a href="#" class="p-3 flex justify-between items-center no-underline text-purple-darker bg-black bg-opacity-[2.5%] hover:bg-opacity-[5%]" @click.prevent="showProfile(profile.id)">
                        <div>
                          <div class="text-sm font-bold">{{ dayjs(profile.created_at).locale('sv').format('D MMMM, YYYY') }}</div>
                        </div>
                        <ion-icon :icon="informationCircleOutline" class="text-2xl"/>
                      </a>
                    </li>
                  </template>
                  <li>
                    <a href="#" class="p-3 flex justify-center items-center no-underline text-black/80 bg-black bg-opacity-[10%]" @click.prevent="() => showAllProfiles = false">
                      <div>
                        Dölj tidigare livsstilsplaner
                      </div>
                    </a>
                  </li>
                </template>
              </template>
            </ul>
          </div>

          <div v-if="!hasActiveProfile" class="mb-8">
            <div v-if="hasCompletedProfiles" class="bg-blue-light p-6 rounded-2xl space-y-4">
              <p class="m-0 leading-relaxed">Är det dags för en ny livsstilsplan?<br>Klicka på knappen för att komma igång.</p>
              <b-button @click="newPlan" class="!bg-blue-darker">Skapa en ny livsstilsplan</b-button>
            </div>
            <div v-else class="bg-blue-light p-6 rounded-2xl space-y-4">
              <p class="m-0 leading-relaxed">Klicka på knappen nedan för att komma igång med din första livsstilsplan!</p>
              <b-button @click="newPlan" class="!bg-blue-darker">Sätt igång</b-button>
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
</style>
