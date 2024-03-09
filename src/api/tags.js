import {useTagStore} from "@/stores/tags.js";
import {defineApi} from "@/api/api.js";
import {LRUCacheStore, PiniaCacheStore, SmartCacheStore} from "@/utils/cache.js";
import {getReqId} from "@/utils/ssr.js";

const tagsCacheStore = new SmartCacheStore('tags', {ttl: 30 * 60000});

export async function loadTags({ignoreReq}) {
    return defineApi({
        method: 'get',
        api: `/tag`,
        store: () => {
            return import.meta.env.SSR ? tagsCacheStore : useTagStore();
        },
        pk: 'req-id',
        data: {
            'req-id': getReqId({}),
        },
        params: {},
        ignoreReq: ignoreReq,
        type: 'data',
        onSuccess: (tags) => {
            const nameMap = new Map();
            tags.forEach(tag => {
                nameMap.set(tag.name, tag);
            });
            return Array.from(nameMap.values());
        },
    });
}
