<script setup lang="ts">
import monsterUrl from '/assets/monster.png';
import SpeechBubble from '@/components/SpeechBubble.vue';
import BDetails from '@/components/BDetails.vue';

const color = 'purple';

defineEmits<{
  (e: 'resize'): void;
}>();
</script>

<template>
  <div class="px-8 mt-8 pb-8 w-full min-h-[540px]">
    <h3 class="m-0 font-light">Mat och energi</h3>

    <div class="mb-2">
      <p class="text-base mt-1 mb-10">Det är viktigt att ha balans mellan fysisk aktivitet och kost och mellan energibehov och energiintag.</p>

      <div class="flex items-center">
        <img class="monster" :src="monsterUrl">

        <div class="relative -top-[40px]">
          <speech-bubble :color="color" class="w-[90%] rotate-[70deg] -scale-x-100 -z-5" />

          <div class="absolute text-[min(4vw,1.15rem)] text-center top-1/2 w-[70%] left-[15%] -translate-y-[57%]">
            För att förstå begreppen Energibehov och Energiintag kan du läsa här
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 mt-4">
        <b-details @toggle="$emit('resize')">
          <template #summary>Mitt Energibehov</template>

          <strong>Mitt Energibehov är X kcal</strong> beräknat från din Fysisk aktivitet i vardagen på arbetet och ditt stillasittande.
        </b-details>

        <b-details @toggle="$emit('resize')">
          <template #summary>Mitt Energiintag</template>

          <strong>Mitt Energiintag är X kcal</strong> beräknat utifrån dina måltidssvar.
        </b-details>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
img.monster {
  width: 35% !important;
}
</style>
