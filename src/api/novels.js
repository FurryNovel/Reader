import {useNovelStore} from "@/stores/novels.js";
import getHandleHeaders, {defineApi} from "@/api/api.js";
import {LRUCacheStore, PiniaCacheStore, SmartCacheStore} from "@/utils/cache.js";
import {getReqId} from "@/utils/ssr.js";
import {useSSRContext} from "vue";


const novelCacheStore = new SmartCacheStore('novel', {ttl: 15 * 60000});
const novelsCacheStore = new SmartCacheStore('novels', {ttl: 30 * 60000});

export function loadNovel({id, onCache, ignoreReq, lang}) {
    const headers = getHandleHeaders();
    return defineApi({
        method: 'get',
        api: `/:lang/novel/:id`,
        store: () => {
            return import.meta.env.SSR ? novelCacheStore : new PiniaCacheStore(useNovelStore());
        },
        pk: 'req-id',
        data: {
            id: id,
            lang: lang,
            'req-id': getReqId({
                id: id,
                ...headers,
            }),
        },
        ignoreReq: ignoreReq,
        onCache: onCache,
        headers: headers,
    });
}

export async function loadNovels({params, ignoreReq, lang}) {
    const headers = getHandleHeaders();
    return defineApi({
        method: 'get',
        api: `/:lang/novel`,
        store: () => {
            return import.meta.env.SSR ? novelsCacheStore : null;
        },
        pk: 'req-id',
        data: {
            lang: lang,
            'req-id': getReqId({
                ...params,
                ...headers,
            }),
        },
        params: params,
        ignoreReq: ignoreReq,
        type: 'list',
        headers: headers,
    });
}
