import getHandleHeaders, {defineApi} from "@/api/api.js";
import {LRUCacheStore, PiniaCacheStore, SmartCacheStore} from "@/utils/cache.js";
import {useChapterStore} from "@/stores/chapters.js";
import {useTableContentStore} from "@/stores/table-contents.js";
import {getReqId} from "@/utils/ssr.js";


const defaultLongCacheStore = new SmartCacheStore('chapter');
const defaultCacheStore = new SmartCacheStore('table-contents', {ttl: 10000});

export function loadChapter({id, novelId, onCache, ignoreReq}) {
    const headers = getHandleHeaders();
    return defineApi({
        method: 'get',
        api: `/novel/:novelId/chapter/:id`,
        store: () => {
            return import.meta.env.SSR ? defaultLongCacheStore : new PiniaCacheStore(useChapterStore());
        },
        pk: 'req-id',
        data: {
            id: id,
            novelId: novelId,
            'req-id': getReqId({
                id: id,
                novelId: novelId,
                ...headers,
            }),
        },
        ignoreReq: ignoreReq,
        onCache: onCache,
        headers: headers,
    });
}

export async function loadChapters({novelId, onCache, ignoreReq, lang}) {
    const headers = getHandleHeaders();
    return defineApi({
        method: 'get',
        api: `/:lang/novel/:novelId/chapter`,
        store: () => {
            return import.meta.env.SSR ? defaultCacheStore : new PiniaCacheStore(useTableContentStore());
        },
        pk: 'req-id',
        data: {
            novelId: novelId,
            'req-id': getReqId({
                novelId: novelId,
                lang: lang,
                ...headers,
            }),
            lang: lang,
        },
        ignoreReq: ignoreReq,
        onCache: onCache,
        type: 'data',
        headers: headers,
    });
}
