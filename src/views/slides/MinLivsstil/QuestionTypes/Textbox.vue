<script setup lang="ts">
import ImageViewer from "@/components/ImageViewer.vue";
import {modalController} from "@ionic/vue";
import { computed, inject } from 'vue';
import { useStore } from '@/stores/main';
import type { ProfileValueChange } from '@/types';
import Info from '@/components/icons/Info.vue';

const props = defineProps({
  data: Object,
});

const store = useStore();

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const questionData = inject('questionData');

const modelProxy = computed<any>({
  get: () => store.profile.values[props.data.name],
  set: val => emit('change', { name: props.data.name, value: val }),
});

async function showPoster(poster: string) {
  const modal = await modalController.create({
    component: ImageViewer,
    componentProps: {
      poster
    }
  });

  await modal.present();

  await modal.onWillDismiss();
}
</script>

<template>
  <div :data-name="data.name">
    <p class="text-base mt-0" v-html="data.description"></p>

    <div v-if="data.poster.url !== null" class="mb-4">
      <a @click.prevent="showPoster(data.poster.url)" href="#" target="_blank" class="flex items-center gap-x-1 no-underline text-black">
        <Info class="text-green-darker" width="20" />
        <span class="text-base leading-none relative top-[1px]">Tryck här för att se {{ data.poster.text }}</span>
      </a>
    </div>

    <div class="flex mb-6 items-center">
      <b-input :id="data.name" v-model="modelProxy" />
      <span class="ml-2 w-8" v-if="data.data?.suffix" v-text="data.data.suffix"></span>
    </div>

    <!-- <div v-if="data.video_id">
      <b-video :video-id="data.video_id" />
    </div> -->
  </div>
</template>
