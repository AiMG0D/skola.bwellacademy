<script setup lang="ts">
import { computed, inject } from 'vue';
import { useStore } from '@/stores/main';
import type { ProfileValueChange } from '@/types';
import Info from '@/components/icons/Info.vue';

const props = defineProps<{
  data: any
}>();

const store = useStore();

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const [descriptionA, descriptionB]: [string, string] = props.data.description.split(',');
const [nameA, nameB]: [string, string] = props.data.name.split(',');
const [suffixA, suffixB]: [string, string] = props.data.data.suffix?.split(',');
</script>

<template>
  <div :data-name="data.name">
    <p class="text-base mb-1" v-html="descriptionA"></p>

    <div class="flex mb-6 items-center">
      <b-input
        :id="nameA"
        @change="$emit('change', { name: nameA, value: $event })"
        v-model="store.profile.values[nameA]"
      />
      <span class="ml-2 w-8" v-if="suffixA" v-text="suffixA"></span>
    </div>

    <p class="text-base mb-1" v-html="descriptionB"></p>

    <div class="flex mb-6 items-center">
      <b-input
        :id="nameB"
        @change="$emit('change', { name: nameB, value: $event })"
        v-model="store.profile.values[nameB]"
      />
      <span class="ml-2 w-8" v-if="suffixB" v-text="suffixB"></span>
    </div>
  </div>
</template>
