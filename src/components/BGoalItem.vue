<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Chevron from '@/components/icons/Chevron.vue';

const props = defineProps(['id', 'checked', 'current', 'vision', 'preventUpdates']);
const emit = defineEmits<{
  (e: 'visionUpdated', data: { id: number, vision: number }): void;
}>();

const inputRef = ref();
const open = ref(false);
const isChecked = ref(props.checked ?? false);
const vision = ref(props.vision ?? props.current);

const classes = computed(() => {
  return [
    'flex',
    'items-center',
    'justify-between',
    'w-full',
    open.value ? 'rounded-t-md' : 'rounded-md',
    'text-base',
    isChecked.value ? 'bg-purple' : 'bg-blue-light',
    isChecked.value ? 'text-white' : 'text-[#21806E]',
    'px-4',
    'py-3',
    'font-medium',
  ];
});

function checked(event) {
  if (props.preventUpdates) {
    isChecked.value = false;
  }

  if (isChecked.value) {
    open.value = true;
  } else {
    open.value = false;
  }
}

function toggleContents() {
  if (!isChecked.value) {
    return;
  }

  open.value = !open.value;
}

watch(vision, (value, oldValue) => {
  emit('visionUpdated', { id: props.id, vision: parseInt(value, 10) });
});
</script>

<template>
  <li class="block shadow-md rounded-md">
    <label class="group">
      <input
        type="checkbox"
        :aria-labelledby="`goal-label-${id}`"
        class="hidden peer"
        v-bind="$attrs"
        ref="inputRef"
        @change="checked"
        v-model="isChecked"
      />
      <div :id="`goal-label-${id}`" :class="classes">
        <slot></slot>

        <button class="text-white bg-transparent" @click.prevent="toggleContents" v-show="isChecked">
          <Chevron :direction="open ? 'up' : 'down'" />
        </button>
      </div>
    </label>

    <div v-show="open" class="p-6 rounded-b-md bg-white">
      <span class="font-medium">
        Resutatet från testet ger dig värde {{ current }}.<br>Välj det värde som du vill uppnå.
      </span>

      <div class="mt-2 flex justify-between items-center">
        <label :for="`goal-vision-${id}`" class="sr-only">Nytt värde</label>
        <select :id="`goal-vision-${id}`" v-model="vision">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>

        <b-button @click="open = false">Spara</b-button>
      </div>
    </div>
  </li>
</template>
