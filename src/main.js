import "fontawesome-6-pro/css/all.css";
import "./assets/main.css";
import "./assets/base.css";

import App from './App.vue';
import {createSSRApp} from 'vue';
import {createRouter} from './router';
import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';
import Ripple from 'primevue/ripple';
import AnimateOnScroll from 'primevue/animateonscroll';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia'
import {createHead} from "@unhead/vue";
import {createRecoveryStorePlugin, localDatabase} from "@/plugins/local-database.js";
import VueCookies from 'vue-cookies'

export function createApp() {
    const app = createSSRApp(App);
    const head = createHead();
    const router = createRouter();
    const pinia = createPinia();
    const primeVueOptions = {
        ripple: true,
        unstyled: true,
        pt: Lara,
        ptOptions: {
            mergeSections: true,
            mergeProps: false,
        },
    }
    app.use(head);
    app.use(PrimeVue?.default || PrimeVue, primeVueOptions);
    app.use(ToastService?.default || ToastService);
    app.use(router);
    app.use(pinia);
    app.use(directivePlugin());
    pinia.use(localDatabase);
    
    let asyncPlugins = [];
    if (!import.meta.env.SSR) {
       asyncPlugins.push(createRecoveryStorePlugin());
       app.use(VueCookies,{
           expireTimes: '360d',
           path: '/',
           domain: '',
           secure: true,
           sameSite: 'Lax'
       });
    }
    return Promise.all(asyncPlugins).then(() => ({
        app,
        router,
        head,
        pinia
    }));
}

function directivePlugin() {
    return {
        install(app) {
            app.directive('ripple', Ripple);
            app.directive('animate-on-scroll', AnimateOnScroll);
        }
    }
}
