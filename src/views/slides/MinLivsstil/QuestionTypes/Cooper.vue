<script setup lang="ts">
import { computed, inject } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useStore } from '@/stores/main';
import type { ProfileValueChange } from '@/types';
import Info from '@/components/icons/Info.vue';

defineProps({
  data: Object,
});

const emit = defineEmits<{
  (e: 'change', value: ProfileValueChange): void;
  (e: 'update'): void;
}>();

const store = useStore();

const weight = computed(() => store.profile.values['weight'] ?? null);

const onChange = useDebounceFn((name: string, event: InputEvent) => {
  const value = (event.target as HTMLInputElement)?.value ?? '';
  emit('change', { name, value });
}, 750);
</script>

<template>
  <div v-if="weight === null || weight === ''" :data-name="data.name">
    <p>Du måste mata in din vikt först.</p>
  </div>
  <div v-else :data-name="data.name">
    <p class="text-base" v-html="data.description"></p>

    <div class="flex text-sm gap-x-1 mb-4 items-start">
      <Info class="text-green-darker shrink-0" width="20" />
      Förslag – ladda ner Runkeeper på din mobil
    </div>

    <div class="flex mb-6 items-center">
      <b-input
        @input="onChange(data.name, $event)"
        v-model="store.profile.values['fitCooperDistance']"
      />
      <span class="ml-2 w-8">m</span>
    </div>
  </div>
</template>
