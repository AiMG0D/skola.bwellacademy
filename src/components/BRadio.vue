<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  label: String,
  labelId: String,
  color: String,
  vertical: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Object,
    default: null,
  },
  modelValue: {},
  value: {},
});

const emit = defineEmits(['update:modelValue']);

/*const isChecked = computed(() => {
  return props.modelValue == props.value;
});*/
const modelProxy = computed({
  get: () => props.modelValue,
  set(val) {},
});

function onChange(e) {
  emit('update:modelValue', props.value);
}

const classes = computed(() => {
  return {
    'flex': true,
    'flex-col': props.vertical,
    'gap-y-2': props.vertical,
    'items-center': true,
    'py-3': true,
    'cursor-pointer': true
  };
});
</script>

<template>
  <label :class="classes">
    <input
      class="absolute left-[-9999px]"
      type="radio"
      :aria-labelledby="labelId"
      :data-colorscheme="color"
      v-bind="$attrs"
      :value="value"
      v-model="modelProxy"
    />
    <span class="w-5 h-5 rounded-full border border-solid border-black mx-2 flex items-center justify-center pointer-events-none">
      <span v-if="modelValue == value" class="inline-block w-3 h-3 rounded-full bg-green-600"></span>
    </span>

    <span :id="labelId" v-html="label" class="pointer-events-none"></span>
    <template v-if="typeof icon !== 'undefined'">
      <component :is="icon" class="ml-auto mr-2 pointer-events-none" />
    </template>
  </label>
</template>

<style scoped lang="postcss">
input[type="radio"] {
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
input[type="radio"]:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
  --tw-ring-offset-width: 2px;
  --tw-ring-offset-color: #fff;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
}
input[type="radio"][data-colorscheme="yellow"]:focus {
  --tw-ring-color: theme(colors.yellow.dark);
}
input[type="radio"][data-colorscheme="green"]:focus {
  --tw-ring-color: theme(colors.green.dark);
}
input[type="radio"][data-colorscheme="blue"]:focus {
  --tw-ring-color: theme(colors.blue.dark);
}
input[type="radio"][data-colorscheme="purple"]:focus {
  --tw-ring-color: theme(colors.purple.dark);
}
input[type="radio"][data-colorscheme="yellow"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23ab8008' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="radio"][data-colorscheme="green"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%234c8201' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="radio"][data-colorscheme="blue"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%2321806e' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
input[type="radio"][data-colorscheme="purple"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='%23752661' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='5'/%3e%3c/svg%3e");
}
</style>
