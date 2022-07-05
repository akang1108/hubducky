import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import ConfirmationService from "primevue/confirmationservice";

import '@/app.scss'

const app = createApp(App);

app.use(store);
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);

app.mount('#app');
