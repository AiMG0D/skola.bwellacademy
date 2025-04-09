<script setup lang="ts">
import BButton from "@/components/BButton.vue";
import SpeechBubble from "@/components/SpeechBubble.vue";
import {IonContent, IonTitle, IonToolbar, modalController} from '@ionic/vue';
import { useStore } from '@/stores/main';
import monsterUrl from '/assets/monster.png';
import {computed, ref} from "vue";

const store = useStore();

const questions = computed(() => {
  return store.feedbackQuestions;
})

const answers = ref({});
const isDone = computed(() => {
  return Object.values(answers.value).filter(v => v !== null).length === questions.value.length;
});

function done() {
  modalController.dismiss(answers.value, 'submit');
}
</script>

<template>
  <ion-content :fullscreen="true">
    <ion-toolbar>
      <ion-title>Avslutande frågor</ion-title>
    </ion-toolbar>

    <div class="flex flex-col px-8 justify-between h-[calc(100%-64px)]">

      <div>
        <div class="flex items-end">
          <img class="monster w-[35%]" :src="monsterUrl">

          <div class="relative">
            <speech-bubble color="green" class="w-[100%] -z-5 rotate-[130deg]">
            </speech-bubble>
            <div class="absolute inset-0 pl-[20%] pr-[10%] pt-4 flex items-center justify-center text-center text-[min(4.5vw,19px)]">
              <div>
                Vänta lite!
                <div class="mt-4 text-[90%]">Ett par avslutande frågor bara om Bwell-arbetet.</div>
              </div>
            </div>
          </div>
        </div>

        <ul class="mt-12 space-y-6 list-none m-0 p-0">
          <li v-for="(q, i) in questions" :key="i" class="p-6 bg-white rounded-xl">
            <div class="text-base leading-tight">{{ (i + 1) }}. {{ q.text }}</div>

            <ul class="list-none m-0 mt-4 p-0 bg-white shadow rounded border border-solid border-green divide-y divide-x-0 divide-solid divide-green-lighter">
              <li v-for="(o, j) in q.options" :key="j">
                <b-radio
                  :name="'bwell-' + q.name + '-' + i"
                  :value="o.value"
                  color="green"
                  :label="o.text"
                  @change="answers[q.name] = o.value"
                  class="mx-4"
                  v-model="answers[q.name]"
                />
              </li>
            </ul>
          </li>
        </ul>

        <div class="my-8 text-center">
          <b-button :disabled="!isDone" @click="done">Klar</b-button>
        </div>
      </div>

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
