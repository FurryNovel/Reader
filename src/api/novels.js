import {useNovelStore} from "@/stores/novels.js";
import {defineApi, LRUCacheStore, PiniaCacheStore} from "@/api/api.js";
import {getReqId} from "@/utils/ssr.js";


const novelCacheStore = new LRUCacheStore(null, {ttl: 15 * 60000});
const novelsCacheStore = new LRUCacheStore(null, {ttl: 30 * 60000});

export function loadNovel({id, onCache, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel/:id`,
        store: () => {
            return import.meta.env.SSR ? novelCacheStore : new PiniaCacheStore(useNovelStore());
        },
        pk: 'id',
        data: {
            id: id,
        },
        ignoreReq: ignoreReq,
        onCache: onCache
    });
}

export async function loadNovels({params, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel`,
        store: () => {
            return import.meta.env.SSR ? novelsCacheStore : null;
        },
        pk: 'req-id',
        data: {
            'req-id': getReqId(params),
        },
        params: params,
        ignoreReq: ignoreReq,
        type: 'list',
    });
}
