import {registerSW} from 'virtual:pwa-register'
import dialog from '@/utils/dialog.js';

const serviceWorker = ref({
    registration: null,
    isOffline: false,
    isNeedRefresh: false,
    installer: null,
    install() {
        if (this.installer) {
            this.installer.prompt();
            this.installer.userChoice.then(({outcome}) => {
                if (outcome === 'accepted') {
                    registerServerWorker();
                    this.installer = null;
                }
            });
        }
    },
    async update() {
        let _r = serviceWorker.value.registration;
        _r = _r || (await getServerWorkerRegistration());
        _r?.waiting?.postMessage({type: 'SKIP_WAITING'});
    }
});

export async function initServiceWorker() {
    if (import.meta.env.SSR) return;
    // noinspection JSValidateTypes
    serviceWorker.value.registration = await navigator?.serviceWorker?.getRegistration();
    if (serviceWorker.value.registration) {
        registerServerWorker();
    }
    if (window.addEventListener) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            serviceWorker.value.installer = e;
        });
    }
}


export function registerServerWorker() {
    return registerSW({
        async onNeedRefresh() {
            serviceWorker.value.isNeedRefresh = true;
        },
        onOfflineReady() {
        },
    });
}

export async function getServerWorkerRegistration() {
    return !import.meta.env.SSR ? await navigator?.serviceWorker?.getRegistration() : null;
}


export function useServiceWorker() {
    return serviceWorker;
}
