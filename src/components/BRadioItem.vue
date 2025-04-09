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
  colorScheme: String,
  expand: {
    type: Boolean,
    default: false,
  },
});

defineEmits<{
  (e: 'picked'): void;
  (e: 'improve', value: string): void;
}>();

const store = useStore();
const router = useIonRouter();

const questionData = inject('questionData');

const profileValue = computed(() => store.getProfileValue(props.name));
const profileFactor = computed(() => store.getProfileFactor(questionData.category_id));
const improveValue = computed(() => profileFactor.value?.improve);
const improveLabel = computed(() => profileFactor.value?.label);
const isChecked = computed(() => profileValue.value);

const borderColor = computed(() => {
  return {
    purple: 'border-purple-light',
    yellow: 'border-yellow-light',
    green: 'border-green-light',
    blue: 'border-blue-light',
  }[props.colorScheme];
});

const classes = ['bg-white', 'list-none', 'shadow', 'rounded', 'border', 'border-solid', borderColor.value];
</script>

<template>
  <li :class="classes">
    <b-radio
      :name="name"
      :value="data.value"
      :color="colorScheme"
      :label="data.label"
      :icon="data.icon"
      :label-name="`${name}-${index}-label`"
      @change="$emit('picked')"
      v-model="isChecked"
      class="mx-4"
    />

    <div v-if="expand && isChecked == data.value" :class="['border-t', 'border-0', 'border-solid', borderColor, 'p-4']">
      <!-- <span>Ditt svar innebär {{ improveLabel }}värde.</span> -->
      <ul class="flex flex-col m-0 p-0">
        <li class="list-none">
          <b-radio
            :name="`${name}-improve`"
            :color="colorScheme"
            value="1"
            label="Detta är jag nöjd med"
            :label-id="`${name}-improve-1-label`"
            @change="$emit('improve', '1')"
            v-model="improveValue"
          />
        </li>
        <li class="list-none">
          <b-radio
            :name="`${name}-improve`"
            :color="colorScheme"
            value="2"
            label="Detta vill jag förbättra"
            :label-id="`${name}-improve-2-label`"
            @change="$emit('improve', '2')"
            v-model="improveValue"
          />
        </li>
      </ul>
    </div>
  </li>
</template>

