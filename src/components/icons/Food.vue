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
  <path d="M8.09999 13.34L10.93 10.51L3.90999 3.5C2.34999 5.06 2.34999 7.59 3.90999 9.16L8.09999 13.34ZM14.88 11.53C16.41 12.24 18.56 11.74 20.15 10.15C22.06 8.24 22.43 5.5 20.96 4.03C19.5 2.57 16.76 2.93 14.84 4.84C13.25 6.43 12.75 8.58 13.46 10.11L3.69999 19.87L5.10999 21.28L12 14.41L18.88 21.29L20.29 19.88L13.41 13L14.88 11.53Z" fill="currentColor"/>
  </g>
  </svg>
</template>
