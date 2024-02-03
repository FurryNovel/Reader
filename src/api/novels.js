import request from "@/utils/request.js";
import {useNovelStore} from "@/stores/novels.js";
import {defineApi} from "@/api/api.js";

export function loadNovel({id, onCache}) {
    return defineApi({
        api: `/novel/:id`,
        store: useNovelStore(),
        data: {
            pk: 'id',
            id: id,
        },
        ignoreReq: false,
        onCache: onCache
    });
}
