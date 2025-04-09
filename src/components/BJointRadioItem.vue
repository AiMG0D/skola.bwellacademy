<script setup lang="ts">
import { computed, inject } from 'vue';
import colors from '@/colors.json';
import { useBackendFetch } from '@/fetch';
import { useStore } from '@/stores/main';
import { useIonRouter } from '@ionic/vue';

const props = defineProps({
  index: Number,
  data: Object,
  name: String,
  color: String,
  expand: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: true,
  }
});

defineEmits<{
  (e: 'picked'): void;
  (e: 'improve', value: string): void;
}>();

const store = useStore();
const router = useIonRouter();

const questionData = inject('questionData');

const profileValue = computed(() => store.getProfileValue(props.name));
const isChecked = computed(() => profileValue.value);
</script>

<template>
  <li class="list-none">
    <b-radio
      :name="name"
      :value="data.value"
      :color="color"
      :label="data.label"
      :label-name="`${name}-${index}-label`"
      @change="$emit('picked')"
      v-model="isChecked"
      class="mx-4"
      :vertical="vertical"
    />
  </li>
</template>

