import App from './App.vue';
import {createSSRApp} from 'vue';
import {createRouter} from './router';
import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';
import Ripple from 'primevue/ripple';
import AnimateOnScroll from 'primevue/animateonscroll';
import ToastService from 'primevue/toastservice';

import "fontawesome-6-pro/css/all.css";
import "./assets/main.css";
import "./assets/base.css";
import {createHead} from "@unhead/vue";

export function createApp() {
    const app = createSSRApp(App);
    const head = createHead();
    const router = createRouter();
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
    app.use(directivePlugin());
    return {app, router, head};
}

function directivePlugin() {
    return {
        install(app) {
            app.directive('ripple', Ripple);
            app.directive('animate-on-scroll', AnimateOnScroll);
        }
    }
}
