import request from "@/utils/request.js";
import {useNovelStore} from "@/stores/novels.js";
import {defineApi} from "@/api/api.js";

export function loadNovel({id, onCache}) {
    return defineApi({
        method: 'get',
        api: `/novel/:id`,
        store: useNovelStore(),
        pk: 'id',
        data: {
            id: id,
        },
        ignoreReq: false,
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
