<script setup lang="ts">
import {alertController, IonContent, IonPage, loadingController, useIonRouter} from '@ionic/vue';
import logoUrl from '/assets/logo.png';
import {useStore} from '@/stores/main';
import {useBackendFetch} from '@/fetch';
import {useNetwork} from '@vueuse/core';
import {FmsType} from "@/types";
import {inject} from "vue";

const store = useStore();

const email = $ref('');
const password = $ref('');

const router = useIonRouter();

const fmsType: FmsType = inject('fms-type') as FmsType;

function login2() {
  // TODO: Login logic
  store.setUserInfo(email.value);

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

  const { error, data, statusCode } = await useBackendFetch('/login').post({ email, password }).json();

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

function cancel() {
  router.navigate('/login', 'back');
}

async function sendPasswordResetLink() {

  const { error, data, statusCode } = await useBackendFetch('/reset-password').post({ email }).json();

  const alert = await alertController.create({
    header: 'Länk skickad',
    message: 'En länk för att återställa lösenordet har skickats till den angivna e-postadressen',
    buttons: [
      {
        text: 'OK',
        handler(value) {
          router.navigate('/login', 'back');
        },
      }
    ]
  })

  alert.present();
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
          Glömt lösenord
        </div>

        <form class="flex flex-col gap-y-2">
          <b-input id="email" type="email" label="E-post:" v-model="email" />

          <b-button class="mt-[2.75rem]" @click="sendPasswordResetLink">
            Skicka återställningslänk
          </b-button>

          <a class="mt-[0.75rem] text-lg underline font-bold text-primary-dark text-center" href="#" @click.prevent="cancel">
            Avbryt
          </a>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --background: #FFFAFD;
}
</style>
