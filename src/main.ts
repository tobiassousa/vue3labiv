import axios from 'axios';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './assets/main.css';

axios.defaults.baseURL="https://8080-mineda-springboot3labiv-hkgigshkty9.ws-us104.gitpod.io/"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')