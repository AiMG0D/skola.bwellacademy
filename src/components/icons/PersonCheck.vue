<script lang="ts" setup>
defineProps({
  width: {
    type: String,
    default: '24',
  },
})
</script>

<template>
  <svg :width="width" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 17L12 14.06C11.61 14.02 11.32 14 11 14C8.33 14 3 15.34 3 18V20H12L9 17ZM11 12C13.21 12 15 10.21 15 8C15 5.79 13.21 4 11 4C8.79 4 7 5.79 7 8C7 10.21 8.79 12 11 12Z" fill="currentColor"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15.47 20.5L12 17L13.4 15.59L15.47 17.67L20.6 12.5L22 13.91L15.47 20.5Z" fill="currentColor"/>
  </g>
  </svg>
</template>
