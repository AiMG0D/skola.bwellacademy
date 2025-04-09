<script setup lang="ts">
import Teamfeeling from '@/components/illustrations/Teamfeeling.vue';
import {FmsType} from "@/types";
import { computed, inject } from 'vue';

const fmsType: FmsType = inject('fms-type') as  FmsType;
const colorScheme = inject('colorScheme', 'yellow');
const nextSlide = inject('nextSlide');

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

const footerColor = computed(() => {
  return {
    purple: 'bg-purple-lighter',
    yellow: 'bg-yellow-lighter',
    green: 'bg-green-lighter',
    blue: 'bg-blue-lighter',
  }[colorScheme];
});
</script>

<template>
  <div :class="['w-full', 'min-h-full', backgroundColor, 'flex', 'flex-col', 'overflow-y-auto']">

    <div class="px-8 text-[#171717] min-h-[400px]" v-if="fmsType === FmsType.Work">
      <h2 class="font-light text-[25px] my-8">Ditt liv på jobbet.</h2>
      <p class="text-lg">En stor del av dagens vakna timmar är vi på jobbet och då är det viktigt att vi trivs och mår bra. Nu ska du svara på frågor om din arbetsmiljö.</p>
    </div>

    <div class="px-8 text-[#171717] min-h-[400px]" v-if="fmsType === FmsType.School">
      <h2 class="font-light text-[25px] my-8">Ditt liv i skolan.</h2>
      <p class="text-lg">En stor del av dagens vakna timmar är vi på skolan och då är det viktigt att vi trivs och mår bra. Nu ska du svara på frågor om din skolmiljö.</p>
    </div>

    <div :class="['h-[232px]', footerColor, 'mt-auto']">
      <div class="flex flex-col justify-between px-8 h-full">
        <Teamfeeling class="mt-[-10.75rem]" width="100%" />

        <b-button class="mb-12" @click="nextSlide">Sätt igång</b-button>
      </div>
    </div>
  </div>
</template>
