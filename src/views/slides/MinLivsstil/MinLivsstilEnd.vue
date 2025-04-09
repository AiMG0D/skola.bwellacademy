<script setup lang="ts">
import { computed, inject, onUnmounted, ref, watch } from 'vue';
import monsterUrl from '/assets/monster/glad.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
import BIconButton from '@/components/BIconButton.vue';
import ArrowDown from '@/components/icons/ArrowDown.vue';

const colorScheme = inject('colorScheme', 'green');

const nextSlide = inject('nextSlide');
const previousSlide = inject('previousSlide');

const scrollableArea = ref<HTMLElement | null>(null);
const scrollButtonVisible = ref(false);

const resizeObserver = new ResizeObserver(async (entries) => {
  if (scrollableArea.value === null) {
    return;
  }

  await recalculateHeight();
});

watch(scrollableArea, (el) => {
  if (el === null) {
    return;
  }

  resizeObserver.observe(el);
});

onUnmounted(() => {
  if (scrollableArea.value === null) {
    return;
  }

  resizeObserver.unobserve(scrollableArea.value);
});

async function recalculateHeight() {
  if (scrollableArea.value === null) {
    return;
  }

  const height = 548;
  const scrollAreaHeight = scrollableArea.value.clientHeight;

  scrollButtonVisible.value = height > scrollAreaHeight;
}

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

function scroll() {
  if (scrollableArea.value === null) {
    return;
  }

  scrollableArea.value.scrollTop += 300;
}
</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col">
    <div class="overflow-y-scroll scroll-smooth" ref="scrollableArea">
      <div class="w-full h-[548px]">
        <div class="relative h-full pt-5 overflow-x-hidden">
          <div class="relative flex w-full top-0 left-[25px]">
            <speech-bubble :color="colorScheme" class="rotate-[18deg] -z-5">
              <div class="-rotate-[18deg] pt-8 pl-4 pr-4 pb-4 text-[23px]">Bra jobbat så<br>här långt!<br>Dags att kolla på resultatet, hur ditt liv ser ut idag.</div>
            </speech-bubble>
          </div>

          <img class="monster absolute h-auto flex-shrink-0 bottom-0" :src="monsterUrl">
        </div>
      </div>
    </div>

    <div class="relative mt-auto px-8 pt-6 mb-12 grid grid-cols-2 gap-4 z-50">
      <div class="absolute -top-6 right-2" v-if="scrollButtonVisible">
        <b-icon-button @click="scroll"><arrow-down /></b-icon-button>
      </div>

      <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
      <b-button @click="nextSlide">Se resultat!</b-button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.monster {
  width: 395px;
}
</style>
