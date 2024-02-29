import {registerSW} from 'virtual:pwa-register'

export async function initServerWorker() {
    if (await checkServerWorker()) {
        registerServerWorker();
    }
}


export function registerServerWorker() {
    return registerSW({
        onNeedRefresh() {
        },
        onOfflineReady() {
        },
    });
}

export async function checkServerWorker() {
    return !import.meta.env.SSR ? await (navigator.serviceWorker.getRegistration().then(registration => !!registration)).catch(() => false) : null;
}
