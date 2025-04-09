import { shallowRef } from 'vue';
import { defineStore } from 'pinia';
import Teamfeeling from '@/components/illustrations/Teamfeeling.vue';
import MittArbeteStart from '@/views/slides/MittArbete/MittArbeteStart.vue';
import MittArbeteEnd from '@/views/slides/MittArbete/MittArbeteEnd.vue';
import MittArbeteQuestion from '@/views/slides/MittArbete/MittArbeteQuestion.vue';

export const useStore = defineStore('pages', {
  state() {
    return {
      pages: [
        {
          number: 1,
          color: 'yellow',
          icon: shallowRef(Teamfeeling),
          title: import.meta.env.APP_FMS_TYPE === 'work' ? 'Mitt arbete' : 'Min skolgång',
          key: 'worklife',
          headerHeightClass: null,
          start: shallowRef(MittArbeteStart),
          question: shallowRef(MittArbeteQuestion),
          end: shallowRef(MittArbeteEnd),
        },
      ],
    };
  },
});
