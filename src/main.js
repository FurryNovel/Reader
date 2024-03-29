import "./assets/main.css";
import "./assets/base.css";

import App from './App.vue';
import {createSSRApp, createApp as createVueApp} from 'vue';
import {createRouter} from './router';
import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';
import Ripple from 'primevue/ripple';
import AnimateOnScroll from 'primevue/animateonscroll';
import ToastService from 'primevue/toastservice';
import {createPinia} from 'pinia'
import {createHead} from "@unhead/vue";
import {createRecoveryStorePlugin, localDatabase} from "@/plugins/local-database.js";
import VueCookies from 'vue-cookies'
import {initialPinia} from "@/plugins/initial-pinia.js";
import {vueBindSSRPlugin, vueSSRMarker} from "vue-unique-ssr-id";
import ConfirmationService from 'primevue/confirmationservice';
import {initRouterEvent} from "@/utils/router-event.js";
import Tooltip from "primevue/tooltip";
import ClientOnly from "@duannx/vue-client-only";
import {setDefaultOptions} from "date-fns";
import {zhCN} from "date-fns/locale";
import xss from "xss";

setDefaultOptions({
    weekStartsOn: 1,
    locale: zhCN,
});

export function createApp() {
    let app = undefined;
    if (import.meta.env.SSR || (typeof window !== 'undefined' && window.__INITIAL_STATE__ !== null)) {
        app = createSSRApp(App);
    } else {
        app = createVueApp(App);
    }
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
    app.use(ConfirmationService?.default || ConfirmationService);
    app.component('ClientOnly', ClientOnly);
    app.use(router);
    app.use(pinia);
    directiveCommand(app);
    pinia.use(localDatabase);
    app.use(vueBindSSRPlugin);
    let asyncPlugins = [];
    if (!import.meta.env.SSR) {
        loadFonts();
        asyncPlugins.push(createRecoveryStorePlugin());
        app.use(VueCookies, {
            expireTimes: '360d',
            path: '/',
            domain: window.location.hostname,
            secure: false,
            sameSite: 'Lax',
        });
        pinia.use(initialPinia)
    }
    return Promise.all(asyncPlugins).then(() => ({
        app,
        router,
        head,
        pinia
    }));
}

function directiveCommand(app) {
    app.directive('ripple', Ripple);
    app.directive('animate-on-scroll', AnimateOnScroll);
    app.directive('ssr', vueSSRMarker);
    app.directive('tooltip', Tooltip);
    const htmlOptions = {
        whiteList: {
            br: [],
            del: [],
            strong: [],
        },
        stripIgnoreTag: true,
    };
    app.directive('safe-html', {
        beforeMount(el, binding) {
            el.innerHTML = xss(binding.value.replace(/\r\n/g, ''), htmlOptions);
        },
        updated(el, binding) {
            el.innerHTML = xss(binding.value.replace(/\r\n/g, ''), htmlOptions);
        },
        getSSRProps(binding, node) {
            return {
                innerHTML: xss(binding.value.replace(/\r\n/g, ''), htmlOptions)
            }
        }
    });
}

function loadFonts() {
    import ("./libs/fontawesome-6-pro/css/all.css");
    import ("misans/lib/Normal/MiSans-Regular.min.css");
    import ("noto-sans-sc/noto_sans_sc_regular/css.css");
}
