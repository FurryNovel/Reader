import {useTagStore} from "@/stores/tags.js";
import getHandleHeaders, {defineApi} from "@/api/api.js";
import {LRUCacheStore, PiniaCacheStore, SmartCacheStore} from "@/utils/cache.js";
import {getReqId} from "@/utils/ssr.js";

const tagsCacheStore = new SmartCacheStore('tags', {ttl: 30 * 60000});

export async function loadTags({ignoreReq, lang}) {
    const headers = getHandleHeaders();
    if (!import.meta.env.SSR) {
        const _store = useTagStore();
        if (!_store.getExpire()) {
            _store.setExpire(Date.now() + 7 * 24 * 60 * 60 * 1000);
        }
    }
    return defineApi({
        method: 'get',
        api: `/:lang/tag`,
        store: () => {
            return import.meta.env.SSR ? tagsCacheStore : useTagStore();
        },
        pk: 'req-id',
        data: {
            'req-id': getReqId({
                ...headers,
            }),
            lang: lang,
        },
        params: {},
        ignoreReq: ignoreReq,
        type: 'data',
        onSuccess: (tags) => {
            const nameMap = new Map();
            tags.forEach(tag => {
                if (!nameMap.has(tag.name)) {
                    nameMap.set(tag.name, tag);
                }
            });
            return Array.from(nameMap.values());
        },
        headers: headers,
    });
}
