import {useTagStore} from "@/stores/tags.js";
import getHandleHeaders, {defineApi} from "@/api/api.js";
import {LRUCacheStore, PiniaCacheStore, SmartCacheStore} from "@/utils/cache.js";
import {getReqId} from "@/utils/ssr.js";

const tagsCacheStore = new SmartCacheStore('tags', {ttl: 30 * 60000});

export async function loadTags({ignoreReq}) {
    const headers = getHandleHeaders();
    return defineApi({
        method: 'get',
        api: `/tag`,
        store: () => {
            return import.meta.env.SSR ? tagsCacheStore : useTagStore();
        },
        pk: 'req-id',
        data: {
            'req-id': getReqId({
                ...headers,
            }),
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
