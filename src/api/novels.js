import request from "@/utils/request.js";
import {useNovelStore} from "@/stores/novels.js";
import {defineApi, LRUCacheStore, PiniaCacheStore} from "@/api/api.js";
import {crc32} from 'hash-wasm';


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

export async function loadNovels({params}) {
    return defineApi({
        method: 'get',
        api: `/novel/`,
        store: () => {
            return import.meta.env.SSR ? defaultCacheStore : null;
        },
        pk: 'req-id',
        data: {
            'req-id': await crc32(JSON.stringify(params)),
        },
        params: params,
        ignoreReq: false,
    });
}
