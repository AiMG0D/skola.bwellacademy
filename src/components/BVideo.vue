<script setup lang="ts">
import videojs from '@mux/videojs-kit';
import '@mux/videojs-kit/dist/index.css';
import { onMounted, ref } from 'vue';

defineProps({
  videoId: String,
});

const playerEl = ref();

onMounted(() => {
  videojs(playerEl.value, {
    preload: 'none',
    controls: true,
  });
});
</script>

<template>
  <video ref="playerEl" class="video-js vjs-16-9">
    <source :src="videoId" type="video/mux" />
  </video>
</template>
