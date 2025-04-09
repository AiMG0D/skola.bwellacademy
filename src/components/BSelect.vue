<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';

const props = defineProps([
  'id',
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
    <select
      :id="id"
      :class="['w-full', 'bg-white', 'border', 'border-solid', borderColor]"
      :value="modelValue"
      @change="update($event.target?.value)"
      v-bind="$attrs"
    >
      <slot/>
    </select>
  </div>
</template>

<style scoped>
label {
  margin-bottom: 0.125rem;
}

select {
  border-radius: 0.5rem !important;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  padding: 1rem 0.75rem 0.875rem 0.875rem;
}
</style>
