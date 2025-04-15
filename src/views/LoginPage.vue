<script setup lang="ts">
import {alertController, IonContent, IonPage, loadingController, useIonRouter} from '@ionic/vue';
import logoUrl from '/assets/logo.png';
import {useStore} from '@/stores/main';
import {useBackendFetch} from '@/fetch';
import {useNetwork} from '@vueuse/core';
import {FmsType} from "@/types";
import {inject, ref} from "vue"; // Import ref from Vue

const store = useStore();

// Replace $ref with ref
const email = ref('');
const password = ref('');

const router = useIonRouter();

const fmsType: FmsType = inject('fms-type') as FmsType;

function login2() {
  // TODO: Login logic
  store.setUserInfo(email.value); // Use .value to access ref values

  router.replace('/home');
}

async function login() {
  const alert = await alertController.create({
    header: 'Ogiltiga inloggningsuppgifter',
    message: 'Ingen användare med de inloggningsuppgifterna hittades.',
    buttons: ['OK'],
  });

  const { isOnline } = useNetwork();

  if (!isOnline.value) {
    alert.header = 'Ingen internetuppkoppling';
    alert.message = 'Det verkar som att du saknar en internetuppkoppling.';

    await alert.present();
    return;
  }

  const loading = await loadingController.create({
    message: 'Loggar in...',
  });

  await loading.present();

  // Pass the ref values with .value
  const { error, data, statusCode } = await useBackendFetch('/login').post({ 
    email: email.value, 
    password: password.value 
  }).json();

  if (error.value !== null) {
    loading.dismiss();

    if (error.value === 'Failed to fetch') {
      alert.header = 'Kunde inte ansluta till servern';
      alert.message = 'Kontrollera att du har en internetuppkoppling och försök igen senare';
    }

    if (statusCode.value === 500) {
      alert.header = 'Ett okänt fel har uppstått';
      alert.message = 'Försök igen senare. Kontakta supporten om felet kvarstår';
    }

    await alert.present();
  } else {
    loading.dismiss();

    store.login(data.value);

    router.replace('/home');
  }
}

function forgotPassword() {
  router.navigate('/forgot-password');
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="px-8 flex flex-col h-full">
        <div class="flex justify-center items-center pt-[5.75rem] pb-[4rem]">
          <img :src="logoUrl" class="w-[150px]">
        </div>

        <div class="text-lg text-[#171717] mb-[2.75rem]">
          <template v-if="fmsType === FmsType.Work">
            <p>
              Bwell ger dig som anställd en personlig Livsstilsplan.
            </p>
            <p>
              Och hjälper dig att bestämma hur du vill ha ditt fysiska, mentala och sociala liv framöver. Sånt som är viktigt för att kunna må bra!
            </p>
          </template>
          <template v-else>
            <p>
              Hej &mdash; Bwell hjälper dig att bestämma hur du vill ha ditt fysiska, mentala och sociala liv framöver. Du ska nu skapa din egen LIVSSTILSPLAN!
            </p>
          </template>
        </div>

        <form class="flex flex-col gap-y-2">
          <b-input id="email" type="email" label="E-post:" v-model="email" />

          <b-input id="password" type="password" label="Lösenord:" v-model="password" />

          <b-button class="mt-[2.75rem]" @click="login">
            Logga in
          </b-button>

          <a class="mt-[0.75rem] text-lg underline font-bold text-primary-dark text-center" href="#" @click.prevent="forgotPassword">
            Glömt lösenord
          </a>
        </form>

        <div class="text-center mt-auto mb-[1.5rem]">
          <a href="https://bwellacademy.com/integritetspolicy/" target="_blank" class="underline text-primary-dark text-sm">Läs vår integritetspolicy</a>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #FFFAFD;
}
</style>
