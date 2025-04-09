<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonContent,
  IonIcon,
  IonTitle,
  IonToolbar,
  modalController
} from '@ionic/vue';
import { useIonRouter } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { useStore } from '@/stores/main';
import { featureNotAvailable } from '@/helpers';

const store = useStore();
const router = useIonRouter();

function close() {
  modalController.dismiss(null, 'cancel');
}

function previousProfiles() {
  featureNotAvailable();
}

async function logout() {
  store.logout();

  await modalController.dismiss(null, 'cancel');

  router.replace('/login');
}
</script>

<template>
  <ion-content :fullscreen="true">
    <ion-toolbar>
      <ion-title>Inställningar</ion-title>

      <ion-buttons slot="end">
        <ion-button @click="close">
          <ion-icon :icon="closeOutline" slot="icon-only" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <div class="flex flex-col px-8 justify-between h-[calc(100%-64px)]">
      <div class="flex flex-col gap-y-4">
        <h2 class="text-primary-dark font-light mt-4 mb-0">Min profil</h2>

        <b-input id="name" type="text" label="Namn" label-color="black" :value="`${store.firstName} ${store.lastName}`" readonly />

        <b-input id="company" type="text" label="Företag" label-color="black" v-model="store.company" readonly />

        <b-input id="email" type="email" label="E-post" label-color="black" v-model="store.email" readonly />

        <!-- <b-input id="password" type="password" label="Lösenord" label-color="black" placeholder="xxxxxx" readonly /> -->

        <!-- <b-input id="new-password" type="password" label="Nytt lösenord" label-color="black" placeholder="Fyll i text" readonly /> -->

        <!-- <b-input id="confirm-password" type="password" label="Bekräfta lösenord" label-color="black" placeholder="Fyll i text" readonly /> -->

        <!--<a href="#" @click.prevent="previousProfiles" class="font-bold text-primary-dark">Mina tidigare profiler</a>-->
      </div>

      <a href="#" @click.prevent="logout" class="text-center font-bold text-primary-dark mb-8">Logga ut</a>
    </div>
  </ion-content>
</template>

<style scoped>
ion-content {
  --background: theme('colors.primary.light');
}
ion-toolbar {
  --background: theme('colors.primary.light');
  --color: theme('colors.primary.dark');
  --min-height: 64px;
}
ion-title {
  font-size: 20px;
}
</style>
