<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {provide} from "vue";

provide('fms-type', import.meta.env.APP_FMS_TYPE);
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
