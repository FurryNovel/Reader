import {registerSW} from 'virtual:pwa-register'
import dialog from '@/utils/dialog.js';


export async function initServerWorker() {
    if (await checkServerWorker()) {
        registerServerWorker();
    }
}


export function registerServerWorker() {
    let _r = null;
    return registerSW({
        async onNeedRefresh() {
            _r = _r || (await getServerWorkerRegistration());
            dialog.toast({
                type: 'info',
                content: '发现新版本，点击此处刷新页面更新',
                position: 'top-right',
            }).then(() => {
                _r.waiting?.postMessage({type: 'SKIP_WAITING'});
            }).catch(() => {
            
            });
        },
        onOfflineReady() {
        },
    });
}

export async function checkServerWorker() {
    return !import.meta.env.SSR ? await (navigator.serviceWorker.getRegistration().then(registration => !!registration)).catch(() => false) : null;
}

export async function getServerWorkerRegistration() {
    return !import.meta.env.SSR ? await navigator.serviceWorker.getRegistration() : null;
}
