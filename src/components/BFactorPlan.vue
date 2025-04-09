<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useStore } from '@/stores/main';

const props = defineProps({
  id: String,
  modelValue: Object,
});

type FactorPlan = {
  checked: boolean;
  plan: string;
};

const emit = defineEmits<{
  (e: 'update:modelValue', value: FactorPlan): void;
}>();

const store = useStore();

const colorScheme = inject('colorScheme', 'yellow');

const text = ref(props.modelValue?.plan ?? '');
const showError = ref(false);

watch(text, (plan) => {
  emit('update:modelValue', { checked: true, plan });
});

const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[colorScheme];
});

function checkEmptyText() {
  showError.value = text.value === '';
}
</script>

<template>
  <textarea id="" class="w-full border-yellow p-2 rounded mt-2" v-model="text" @blur="checkEmptyText"></textarea>
</template>

