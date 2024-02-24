import {useServerSideRenderStore} from "@/stores/ssr.js";
import {useId} from "vue-unique-ssr-id";
import CRC32 from "crc-32";

export function getReqId(params = {}) {
    return CRC32.str(JSON.stringify(params)).toString(16);
}


export function useServerData({reqId = null}) {
    const ssrStore = useServerSideRenderStore();
    if (!reqId) {
        reqId = useId();
    }
    return ssrStore.find(reqId);
}

export function onServerData(hook, reqId = null) {
    if (import.meta.env.SSR) {
        return Promise.resolve();
    }
    const ssrStore = useServerSideRenderStore();
    if (!reqId) {
        reqId = useId();
    }
    let prefetch = ssrStore.find(reqId);
    if (prefetch) {
        prefetch = hook(prefetch) ?? prefetch;
        ssrStore.delete(reqId);
        return Promise.resolve(prefetch);
    }
    return Promise.reject();
}

/**
 * @param reqId{any}
 * @param data{any}
 * @param instance{any}
 */
export function provideServerData({reqId = null, data, instance = null}) {
    if (import.meta.env.SSR) {
        if (instance === null)
            throw new Error('provideServerData must be called with a Vue instance');
        instance = instance.appContext.config.globalProperties.$pinia;
    }
    const ssrStore = useServerSideRenderStore(instance);
    if (!reqId) {
        reqId = useId();
    }
    ssrStore.save(reqId, data);
}
