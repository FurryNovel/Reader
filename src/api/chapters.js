import {defineApi, LRUCacheStore, PiniaCacheStore} from "@/api/api.js";
import {useChapterStore} from "@/stores/chapters.js";


const defaultLongCacheStore = new LRUCacheStore();
const defaultCacheStore = new LRUCacheStore(null, {ttl: 10000});

export function loadChapter({id, novelId, onCache, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel/:novelId/chapter/:id`,
        store: () => {
            return import.meta.env.SSR ? defaultLongCacheStore : new PiniaCacheStore(useChapterStore());
        },
        pk: 'id',
        data: {
            id: id,
            novelId: novelId,
        },
        ignoreReq: ignoreReq,
        onCache: onCache
    });
}

export async function loadChapters({novelId, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel/:novelId/chapter`,
        store: () => {
            return import.meta.env.SSR ? defaultCacheStore : null;
        },
        pk: 'novelId',
        data: {
            novelId: novelId,
        },
        ignoreReq: ignoreReq,
        type: 'data',
    });
}
