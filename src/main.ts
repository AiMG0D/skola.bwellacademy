import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import BButton from '@/components/BButton.vue';
import BInput from '@/components/BInput.vue';
import BRadio from '@/components/BRadio.vue';
import BVideo from '@/components/BVideo.vue';
import BStartButton from '@/components/BStartButton.vue';
import BCheckboxItem from '@/components/BCheckboxItem.vue';
import BRadioCheckbox from '@/components/BRadioCheckbox.vue';

import './assets';

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue, {
    mode: 'ios',
    swipeBackEnabled: false,
  })
  .use(router)
  .use(pinia)
  .component('BButton', BButton)
  .component('BInput', BInput)
  .component('BRadio', BRadio)
  .component('BRadioCheckbox', BRadioCheckbox)
  .component('BVideo', BVideo)
  .component('BStartButton', BStartButton)
  .component('BCheckboxItem', BCheckboxItem);

router.isReady().then(() => {
  app.mount('#app');
});
