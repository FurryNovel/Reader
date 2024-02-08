import {createCRC32} from "hash-wasm";
import {useServerSideRenderStore} from "@/stores/ssr.js";
import {useId} from "vue-unique-ssr-id";

const crc32Instance = (await createCRC32());

export function getReqId(params = {}) {
    // noinspection JSCheckFunctionSignatures
    return crc32Instance.init().update(JSON.stringify(params)).digest('hex', null);
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
    if (prefetch){
        prefetch = hook(prefetch) ?? prefetch;
        return Promise.resolve(prefetch);
    }
    return Promise.reject();
}

export function provideServerData({reqId = null, data}) {
    const ssrStore = useServerSideRenderStore();
    if (!reqId) {
        reqId = useId();
    }
    ssrStore.save(reqId, data);
}
