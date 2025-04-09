<script setup lang="ts">
import {IonIcon, modalController} from "@ionic/vue";
import {close} from "ionicons/icons";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

const props = defineProps<{
  poster: string;
}>();

const restrictions: any = {
  0: null,
  14: 115,
  11: 150,
  13: 155,
  16: 155
};

function onBackButton() {
  dismiss();
}

onMounted(() => {
  document.addEventListener("backbutton", onBackButton, false);
});

onBeforeUnmount(() => {
  document.removeEventListener("backbutton", onBackButton);
});

const posterNumber = computed(() => {
  const matches = props.poster.match(/-(\d+)\.jpg$/i);

  if (!matches) {
    return 0;
  }

  return parseInt(matches[1]);
});

const canZoom = computed(() => {
  return restrictions[posterNumber.value] !== null;
});

const maxZoom = computed(() => {
  return restrictions[posterNumber.value] || 170;
});

function dismiss() {
  modalController.dismiss();
}

const isFocused = ref(false);
function focus() {
  if (!canZoom.value) {
    isFocused.value = false;
    return;
  }

  isFocused.value = !isFocused.value;
}
</script>

<template>
  <div class="fixed z-[1000] inset-0 bg-slate-900 flex items-center justify-start">
    <button @click="dismiss" type="button" class="absolute right-1 top-1 bg-white/10 rounded-lg flex items-center justify-center w-10 h-10">
      <ion-icon :icon="close" class="text-white text-3xl"/>
    </button>

    <div v-if="canZoom" class="absolute left-2 top-2 right-1/2 text-white/70 font-sans -z-10">
      Klicka på bilden för att zooma in på texten
    </div>

    <img :src="poster" alt="Poster" @click="focus" :class="{
      'max-w-none transition-all': true,
    }" :style="{
      width: isFocused ? `${maxZoom}%` : '100%',
    }">
  </div>
</template>
