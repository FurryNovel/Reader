import request from "@/utils/request.js";
import {useNovelStore} from "@/stores/novels.js";
import {defineApi, LRUCacheStore, PiniaCacheStore} from "@/api/api.js";

const defaultCacheStore = new LRUCacheStore();

export function loadNovel({id, onCache, ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/novel/:id`,
        store: () => {
            return import.meta.env.SSR ? defaultCacheStore : new PiniaCacheStore(useNovelStore());
        },
        pk: 'id',
        data: {
            id: id,
        },
        ignoreReq: ignoreReq,
        onCache: onCache
    });
}

export function loadNovels({params}) {
    return defineApi({
        method: 'get',
        api: `/novel/`,
        store: null,
        data: {},
        params: data,
        ignoreReq: false,
    });
}
