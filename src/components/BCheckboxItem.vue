<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
defineProps(['id']);
</script>

<template>
  <label class="group">
    <input
      type="checkbox"
      :aria-labelledby="`checkbox-label-${id}`"
      class="hidden peer"
      v-bind="$attrs"
    />
    <div
      :id="`checkbox-label-${id}`"
      class="flex items-center rounded-md text-base shadow text-[#21806E] bg-blue-light peer-checked:bg-purple peer-checked:text-white px-4 py-3 font-medium"
    >
      <slot></slot>
    </div>
  </label>
</template>
