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
  <path d="M5 11H1V22H5V11Z" fill="currentColor"/>
  <path d="M16 3.25C16.65 2.49 17.66 2 18.7 2C20.55 2 22 3.45 22 5.3C22 7.57 19.09 10.2 16 13C12.91 10.19 10 7.56 10 5.3C10 3.45 11.45 2 13.3 2C14.34 2 15.35 2.49 16 3.25Z" fill="currentColor"/>
  <path d="M20 17H13L10.91 16.27L11.24 15.33L13 16H15.82C16.47 16 17 15.47 17 14.82C17 14.33 16.69 13.89 16.23 13.71L8.97 11H7V20.02L14 22L22.01 19C22 17.9 21.11 17 20 17Z" fill="currentColor"/>
  </g>
  </svg>
</template>
