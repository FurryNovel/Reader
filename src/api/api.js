import request from "@/utils/request.js";

const nil = (args) => args;

/**
 * @description 定义一个api
 * @param api {string} 接口地址
 * @param store {Object} 存储Store
 * @param data {Object} 请求参数
 * @param ignoreReq {boolean} 有缓存时是否忽略请求
 * @param onCache {function} 有缓存时的回调
 * @param onError {function} 请求失败时的回调
 * @param onSuccess {function} 请求成功时的回调
 * @returns {Promise<unknown>}
 */
export function defineApi({
                              api,
                              store = null,
                              data = {pk: 'id',},
                              ignoreReq = false,
                              onCache = nil,
                              onError = nil,
                              onSuccess = nil
                          }) {
    return new Promise(async(resolve, reject) =>  {
        api = api.replace(/:(\w+)/g, (match, key) => {
            return data[key];
        });
        let id = data[data.pk] ?? data.id ?? data.pk ?? data;
        let cacheData = await store.find(id);
        if (cacheData) {
            onCache(cacheData);
            if (ignoreReq) {
                reject();
                return;
            }
        }
        resolve(request.get(api, {
            data: data,
        }).then(res => {
            let responseData = onSuccess(res?.data) ?? res?.data;
            if (store && responseData) {
                store.save(id, responseData);
                return responseData;
            }
            return Promise.reject();
        }).catch(err => {
            return Promise.reject(onError(err) ?? err);
        }));
    });
}
