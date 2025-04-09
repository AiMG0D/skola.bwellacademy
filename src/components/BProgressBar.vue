<script setup lang="ts">
import {computed, inject, ref, watch} from 'vue';
import { clamp } from '@/helpers';

const props = defineProps<{
  current: number;
  max: number;
  interactive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'slide', value: number): void;
}>();

const currentValue = ref<number>(props.current);

watch(() => props.current, () => {
  currentValue.value = props.current;
})

const colorScheme = inject('colorScheme', 'yellow');

const barColor = computed(() => {
  return {
    purple: 'bg-purple-dark',
    yellow: 'bg-yellow-dark',
    green: 'bg-green-dark',
    blue: 'bg-blue-dark',
  }[colorScheme];
});

const textColor = computed(() => {
  return {
    purple: 'text-purple-darker',
    yellow: 'text-yellow-darker',
    green: 'text-green-darker',
    blue: 'text-blue-darker',
  }[colorScheme];
});

const barWidth = computed(() => `${(currentValue.value / props.max) * 100}%`);

function emitIfChanged() {
  if (currentValue.value !== props.current) {
    emit('slide', currentValue.value);
  }
}

function getNormalizedValue(target: HTMLElement, x: number): number {
  const rect = (target as HTMLElement).getBoundingClientRect();
  return Math.max(1, Math.round(clamp((x - rect.left) / rect.width, 0, 1) * props.max));
}

function onClick(e: MouseEvent) {
  if (!props.interactive) {
    return;
  }

  currentValue.value = getNormalizedValue(e.target as HTMLElement, e.clientX);
  emitIfChanged();
}
function onDrag(e: TouchEvent) {
  if (!props.interactive) {
    return;
  }

  currentValue.value = getNormalizedValue(e.target as HTMLElement, e.touches[0].clientX);
}
function onDragEnd() {
  if (!props.interactive) {
    return;
  }

  emitIfChanged();
}
</script>

<template>
  <div class="flex items-center">
    <div :class="['grow-0', 'mr-3', 'font-medium', textColor, 'w-[64px]', 'text-right']">
      {{ clamp(currentValue, 0, max) }} av {{ max }}
    </div>

    <div class="grow max-w-[70%] py-2" @click.prevent="onClick" @touchmove="onDrag" @touchend="onDragEnd">
      <div class="bg-white w-full h-2 rounded-full overflow-hidden pointer-events-none">
        <div :class="['fill', barColor, 'h-full', 'transition-[width]']"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fill {
  width: v-bind(barWidth);
  transition-property: width;
}
</style>
