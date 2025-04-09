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
const colorScheme = inject('colorScheme', 'purple');

const borderColor = computed(() => {
  return {
    purple: 'border-purple-darker',
    yellow: 'border-yellow-darker',
    green: 'border-green-darker',
    blue: 'border-blue-darker',
  }[colorScheme];
});

const pushupsTypeValue = computed(() => store.getProfileValue('pushupsType') ?? 1);

async function onChange(value) {
  if (store.sex === 'F' && store.getProfileValue('pushupsType') === null) {
    await store.setProfileValue('pushupsType', 1);
  }

  emit('change', { name: props.data.name, value });
}

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

    <div class="flex flex-col">
      <div class="flex mb-6 items-center">
        <b-input
          :id="data.name"
          @change="onChange($event)"
          v-model="store.profile.values[data.name]"
        />
        <span class="ml-2 w-8" v-if="data.data?.suffix" v-text="data.data.suffix"></span>
      </div>

      <div v-if="store.sex === 'F'">
        <ul :class="borderColor" class="flex justify-around border border-solid shadow rounded-lg my-0 gap-y-2 px-3 py-2 bg-white">
          <li class="list-none">
            <b-radio
              name="pushupsType"
              :value="0"
              :color="colorScheme"
              label="På tå"
              label-name="pushupsType-0-label"
              @change="$emit('change', { name: 'pushupsType', value: '0' })"
              v-model="pushupsTypeValue"
              class="mr-4"
              :vertical="false"
            />
          </li>

          <li class="list-none">
            <b-radio
              name="pushupsType"
              :value="1"
              :color="colorScheme"
              label="På knä"
              label-name="pushupsType-1-label"
              @change="$emit('change', { name: 'pushupsType', value: '1' })"
              v-model="pushupsTypeValue"
              class="mr-4"
              :vertical="false"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
