<script setup lang="ts">
import BButton from "@/components/BButton.vue";
import LifestyleResult from "@/components/results/LifestyleResult.vue";
import { computed, inject, ref } from 'vue';
import BIconButton from '@/components/BIconButton.vue';
import ArrowDown from '@/components/icons/ArrowDown.vue';
import { useStore } from '@/stores/main';
import { useIonRouter } from '@ionic/vue';

const props = defineProps<{
  sections: any[]
}>();

const store = useStore();
const router = useIonRouter();

const colorScheme = inject('colorScheme', 'green');
const previousSlide = inject('previousSlide');

const backgroundColor = computed(() => {
  return {
    purple: 'bg-purple-background',
    yellow: 'bg-yellow-background',
    green: 'bg-green-background',
    blue: 'bg-blue-background',
  }[colorScheme];
});

async function next() {
  router.replace('/goals');
}

const scrollArea = ref<any>(null);

function scroll() {
  if (scrollArea.value === null) {
    return;
  }

  scrollArea.value.scrollTop += 9999;
}

</script>

<template>
  <div :class="backgroundColor" class="w-full h-full flex flex-col">
    <div class="text-[#171717] flex flex-col w-full relative overflow-y-auto scroll-smooth" ref="scrollArea">
      <h2 class="font-light mb-0 px-8">Bra jobbat, se resultatet!</h2>
      <p class="text-base px-8 mb-1">Klicka på en tårtbit för att se mer information om ditt resultat.</p>

      <div class="text-sm text-black/60 px-8 mb-4">Om du har fått en vit tårtbit beror det på att du inte besvarat samtliga frågor inom området.</div>

      <LifestyleResult :sections="props?.sections || []" :factors="store.profile?.factors" />
    </div>

    <div class="mt-auto px-8 pt-10 pb-8 relative button-border">
      <div class="absolute -top-6  right-2">
        <b-icon-button @click="scroll"><arrow-down /></b-icon-button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <b-button @click="previousSlide" look="secondary">Tillbaka</b-button>
        <b-button @click="next">Nästa</b-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.button-border {
  box-shadow: 0px -0.5px 2px 0px rgba(0, 0, 0, 0.25);
}
</style>
