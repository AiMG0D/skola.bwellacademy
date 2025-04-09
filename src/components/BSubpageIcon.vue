<script setup lang="ts">
import { computed, inject } from 'vue';
import Check from '@/components/icons/Check.vue';
import Handball from '@/components/icons/Handball.vue';
import PersonCheck from '@/components/icons/PersonCheck.vue';
import HandHeart from '@/components/icons/HandHeart.vue';
import Cigarette from '@/components/icons/Cigarette.vue';
import Food from '@/components/icons/Food.vue';
import Flower from '@/components/icons/Flower.vue';
import People from '@/components/icons/People.vue';
import Info from '@/components/icons/Info.vue';

const props = defineProps({
  icon: String,
  header: {
    type: Boolean,
    default: false,
  },
  small: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const colorScheme = inject('colorScheme', 'green');

const iconEl = computed(() => {
  return {
    'physical': Handball,
    'physical_questions': PersonCheck,
    'wellbeing': HandHeart,
    'drugs': Cigarette,
    'energy': Food,
    'activities': Flower,
    'kasam': People,
    'info': Info,
  }[props.icon];
});

const backgroundColor = computed(() => {
  if (props.active) {
    return 'bg-purple-dark';
  }

  return {
    purple: props.header ? 'bg-purple' : 'bg-purple-light',
    yellow: props.header ? 'bg-yellow' : 'bg-yellow-light',
    green: props.header ? 'bg-green' : 'bg-green-light',
    blue: props.header ? 'bg-blue' : 'bg-blue-light',
  }[colorScheme];
});

const borderColor = computed(() => {
  if (props.active) {
    return null;
  }

  if (props.checked) {
    return 'border-purple-dark';
  }

  return {
    purple: 'border-purple-dark',
    yellow: 'border-yellow-dark',
    green: 'border-green-dark',
    blue: 'border-blue-dark',
  }[colorScheme];
});

const iconColor = computed(() => {
  if (props.active || props.checked) {
    return 'text-white';
  }

  return {
    purple: 'text-purple-dark',
    yellow: 'text-yellow-dark',
    green: 'text-green-dark',
    blue: 'text-blue-dark',
  }[colorScheme];
});

const checkColor = computed(() => {
  return {
    purple: 'text-purple-dark',
    yellow: 'text-yellow-dark',
    green: 'text-green-dark',
    blue: 'text-blue-dark',
  }[colorScheme];
});

const checkOutline = computed(() => {
  return {
    purple: 'stroke-purple-light',
    yellow: 'stroke-yellow-light',
    green: 'stroke-green-light',
    blue: 'stroke-blue-light',
  }[colorScheme];
});

const iconWidth = computed(() => props.small ? '20' : '24');

const classes = computed(() => {
  const c = [
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'flex-shrink-0',
    props.small ? 'w-8' : 'w-10',
    props.small ? 'h-8' : 'h-10',
  ];

  if(props.active) {
    c.push('outline outline-2 outline-offset-2 outline-purple-dark/50');
  }

  if (props.checked) {
    if (borderColor.value) {
      c.push('border');
      c.push('border-solid');
      c.push(borderColor.value);
    }
    c.push('bg-purple-dark');
  } else {
    c.push(backgroundColor.value);
  }

  return c;
});
</script>

<template>
  <div :class="classes">
    <Check v-if="checked" :class="['absolute', checkOutline, 'top-0', 'right-0', '-mt-2.5', '-mr-2', 'stroke-[3]']" />
    <Check v-if="checked" :class="['absolute', checkColor, 'top-0', 'right-0', '-mt-2.5', '-mr-2']" />
    <component :is="iconEl" :class="iconColor" :width="iconWidth" />
  </div>
</template>
