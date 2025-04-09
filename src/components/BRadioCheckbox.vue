<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  id: String,
  color: String,
  modelValue: Boolean,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const modelProxy = computed(() => props.modelValue);
</script>

<template>
  <label class="flex items-center py-3">
    <input
      type="checkbox"
      :aria-labelledby="id"
      :data-colorscheme="color"
      v-bind="$attrs"
      v-model="modelProxy"
      @input="$emit('update:modelValue', $event.target.checked)"
    />
    <span :id="id">
      <slot></slot>
    </span>
  </label>
</template>

<style scoped lang="postcss">
input[type="checkbox"] {
  appearance: none;
  padding: 0;
  display: inline-block;
  user-select: none;
  vertical-align: middle;
  margin-right: 1rem;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid #2E495A;
  background-origin: border-box;
  border-radius: 100%;
  @apply focus:ring-indigo-500
}
input[type="checkbox"]:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
input[type="checkbox"][data-colorscheme="yellow"]:focus {
  --tw-ring-color: theme(colors.yellow.dark);
}
input[type="checkbox"][data-colorscheme="green"]:focus {
  --tw-ring-color: theme(colors.green.dark);
}
input[type="checkbox"][data-colorscheme="blue"]:focus {
  --tw-ring-color: theme(colors.blue.dark);
}
input[type="checkbox"][data-colorscheme="purple"]:focus {
  --tw-ring-color: theme(colors.purple.dark);
}
input[type="checkbox"][data-colorscheme="yellow"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23ab8008' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="checkbox"][data-colorscheme="green"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%234c8201' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="checkbox"][data-colorscheme="blue"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%2321806e' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="checkbox"][data-colorscheme="purple"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23752661' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
</style>
