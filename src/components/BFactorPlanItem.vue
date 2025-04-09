<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useStore } from '@/stores/main';

const props = defineProps({
  id: String,
  modelValue: Object,
  showErrors: Boolean,
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

const open = ref(props.modelValue?.checked ?? false);
const text = ref(props.modelValue?.plan ?? '');
const planError = ref(false);

watch([open, text], ([checked, plan]) => {
  emit('update:modelValue', { checked, plan });
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
  planError.value = text.value === '';
}
</script>

<template>
  <li :class="['bg-white', 'list-none', 'shadow', 'rounded', 'border', 'border-solid', borderColor]">
    <b-radio-checkbox
      :color="colorScheme"
      class="mx-4"
      v-model="open"
    >
      <slot></slot>
    </b-radio-checkbox>

    <div v-if="open" :class="['border-t', 'border-0', 'border-solid', borderColor, 'p-4']">
      <label for="">Jag ska påverka detta genom att:</label>
      <textarea id="" class="w-full border-yellow p-2 rounded mt-2" v-model="text" @blur="checkEmptyText"></textarea>
      <p v-if="showErrors || planError" class="mt-2 mb-0 text-red-500 font-medium text-sm">Du måste fylla i text.</p>
    </div>
  </li>
</template>

