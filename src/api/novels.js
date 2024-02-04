import request from "@/utils/request.js";
import {useNovelStore} from "@/stores/novels.js";
import {defineApi, getReqId, LRUCacheStore, PiniaCacheStore} from "@/api/api.js";


const defaultLongCacheStore = new LRUCacheStore();
const defaultCacheStore = new LRUCacheStore(null, {ttl: 10000});

export function loadNovel({id, onCache, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel/:id`,
        store: () => {
            return import.meta.env.SSR ? defaultLongCacheStore : new PiniaCacheStore(useNovelStore());
        },
        pk: 'id',
        data: {
            id: id,
        },
        ignoreReq: ignoreReq,
        onCache: onCache
    });
}

export async function loadNovels({params}) {
    return defineApi({
        method: 'get',
        api: `/novel`,
        store: () => {
            return import.meta.env.SSR ? defaultCacheStore : null;
        },
        pk: 'req-id',
        data: {
            'req-id': getReqId(params),
        },
        params: params,
        ignoreReq: false,
    });
}
