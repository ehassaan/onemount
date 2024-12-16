import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const vuetify = createVuetify({
    // icons: {
    //     defaultSet: 'mdi',
    //     aliases,
    //     sets: {
    //         mdi,
    //     },
    // }
});

const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount('#app');
