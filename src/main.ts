import { createApp } from 'vue';
import App from './App.vue';
import { router } from './app/providers/router';
import { pinia } from './app/providers/pinia';
import { queryPlugin } from './app/providers/query';
import './app/styles/index.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(queryPlugin);

app.mount('#app');
