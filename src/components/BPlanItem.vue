<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { computed, ref, unref, watch } from 'vue';
import { useTimeout } from '@vueuse/core';
import Chevron from '@/components/icons/Chevron.vue';
import BFactorPlanItem from '@/components/BFactorPlanItem.vue';

const props = defineProps<{
  data: any;
  expanded?: boolean;
}>();

const open = ref(props.expanded || false);

const classes = computed(() => {
  return [
    'flex',
    'items-center',
    'w-full',
    open.value ? 'rounded-t-md' : 'rounded-md',
    'text-base',
    'bg-yellow-light',
    'text-yellow-darker',
    'px-4',
    'py-3',
    'font-medium',
  ];
});
</script>

<template>
  <li class="block shadow-md rounded-md">
    <button :class="classes" @click="open = !open">
      <div><slot></slot></div>

      <Chevron class="ml-auto" :direction="open ? 'up' : 'down'" />
    </button>

    <div v-show="open" class="p-6 rounded-b-md bg-white">
      <h2 class="mt-0 font-light text-xl">
        Jag ska jobba med riskfaktorn
        <span class="text-yellow-darker font-medium">{{ data.label }}</span>
      </h2>

      <p v-if="data.date">Och planerar att bli klar {{ data.date }}.</p>

      <template v-if="data.factors?.length > 0">
        <p class="text-lg mb-2">Jag ska arbeta med:</p>

        <ul class="flex flex-col m-0 p-0 gap-y-2">
          <li class="list-none" v-for="factor in data.factors">
            <!--<h3 class="mt-0 mb-1 text-yellow-darker font-medium">{{ factor.label }}</h3>-->
            <p class="p-0 m-0">{{ factor.plan }}</p>
          </li>
        </ul>
      </template>
      <template v-else-if="data.texts?.length > 0">
        <ul class="flex flex-col m-0 p-0 gap-y-2">
          <template v-for="text in data.texts">
            <li class="list-none" v-if="text.plan && text.plan.length > 2 && !text.factor.startsWith('planWhen')">
              <p class="p-0 m-0">{{ text.plan }}</p>
            </li>
          </template>
        </ul>
      </template>
    </div>
  </li>
</template>
