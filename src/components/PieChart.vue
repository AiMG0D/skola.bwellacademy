<script setup lang="ts">
const props = defineProps<{
  segments: number;
  colors: string[];
  labels?: string[];
  modelValue?: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

function circleSegment(index: number, total: number) {
  let a1 = (index / total) * Math.PI * 2;
  let a2 = ((index + 1) / total) * Math.PI * 2;

  let x1 = Math.sin(a1);
  let x2 = Math.sin(a2);

  let y1 = -Math.cos(a1);
  let y2 = -Math.cos(a2);

  let radius = 35;
  let innerRadius = 5;

  let x = 50;
  let y = 50;

  return `
    M ${x + x1 * radius} ${y + y1 * radius}
    A ${radius} ${radius} 0 0 1 ${x + x2 * radius} ${y + y2 * radius}
    L ${x + x2 * innerRadius} ${y + y2 * innerRadius}
    A ${innerRadius} ${innerRadius} 0 0 0 ${x + x1 * innerRadius} ${y + y1 * innerRadius}
    L ${x + x1 * radius} ${y + y1 * radius}
  `;
}

async function delay(d: number) {
  await new Promise(r => setTimeout(r, d));
}
async function onSliceClick(index: number) {
  if(props.modelValue === undefined) {
    return;
  }

  if(props.modelValue === index) {
    emit('update:modelValue', null);
  } else if(props.modelValue === null) {
    emit('update:modelValue', index);
  } else {
    emit('update:modelValue', null);
    await delay(300);
    emit('update:modelValue', index);
  }
}

function highlightSlice(index: number, total: number, offsetY = 0) {
  if(index === props.modelValue) {
    let a = ((index + 0.5) / total) * Math.PI * 2;
    return `translate3d(${Math.sin(a) * 5}px, ${-Math.cos(a) * 5 + offsetY}px, 0) scale(1.1)`;
  }

  return `translate3d(0, ${offsetY}px, 0)`;
}

function labelX(index: number): string {
  const segmentSize = (Math.PI * 2) / props.segments;
  const halfSegment = segmentSize / 2;
  const angle = index * segmentSize + halfSegment;
  return (50 + Math.sin(angle) * (27 + (props.modelValue === index ? 9 : 0))) + '%';
}
function labelY(index: number): string {
  const segmentSize = (Math.PI * 2) / props.segments;
  const halfSegment = segmentSize / 2;
  const angle = index * segmentSize + halfSegment;
  return (50 - Math.cos(angle) * (27 + (props.modelValue === index ? 9 : 0))) + '%';
}

</script>

<template>
  <svg class="w-full aspect-square" viewBox="0 0 100 100">
    <template v-for="index in props.segments">
      <path :d="circleSegment(index - 1, props.segments)"
            :class="['transition origin-center fill-slate-950/20 blur-[1px]']"
            :style="{transform: highlightSlice(index - 1, props.segments, 2.5)}" />
    </template>

    <template v-for="index in props.segments">
      <path :d="circleSegment(index - 1, props.segments)"
            :class="[props.colors[index - 1], 'transition origin-center']"
            :style="{transform: highlightSlice(index - 1, props.segments)}"
            @click="onSliceClick(index - 1)" />
    </template>

    <template v-for="index in props.segments">
      <path :d="circleSegment(index - 1, props.segments)"
            :class="['stroke-[0.15] stroke-slate-900 fill-transparent pointer-events-none transition origin-center']"
            :style="{transform: highlightSlice(index - 1, props.segments)}" />
    </template>
  </svg>

  <template v-if="props.labels !== undefined">
    <template v-for="index in props.segments">
      <div class="absolute text-base -mt-0.5 -translate-x-1/2 -translate-y-1/2 transition-all pointer-events-none" :style="{'left': labelX(index - 1), 'top': labelY(index - 1)}">
        {{ props.labels[index - 1] }}
      </div>
    </template>
  </template>
</template>

<style scoped>

</style>
