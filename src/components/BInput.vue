<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';

const props = defineProps([
  'id',
  'type',
  'placeholder',
  'label',
  'labelColor',
  'modelValue',
]);

const emit = defineEmits(['update:modelValue', 'change']);

const colorScheme = inject('colorScheme', 'purple');

const borderColor = computed(() => {
  return {
    purple: 'border-purple-darker',
    yellow: 'border-yellow-darker',
    green: 'border-green-darker',
    blue: 'border-blue-darker',
  }[colorScheme];
});

function update(value) {
  emit('update:modelValue', value);
  emit('change', value);
}
</script>

<template>
  <div class="grow">
    <label
      :for="id"
      :class="['inline-block', 'text-left', 'text-sm', labelColor === 'black' ? 'text-[#020202]' : 'text-primary']"
      v-text="label"
    ></label>
    <input
      :id="id"
      :type="type"
      :class="['w-full', 'bg-white', 'border', 'border-solid', borderColor]"
      :placeholder="placeholder"
      :value="modelValue"
      @input="update($event.target?.value)"
      v-bind="$attrs"
    >
  </div>
</template>

<style scoped>
label {
  margin-bottom: 0.125rem;
}

input {
  border-radius: 0.5rem !important;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  padding: 1rem 0.75rem 0.875rem 0.875rem;
}
</style>
