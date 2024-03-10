import request from "@/utils/request.js";
import {useSSRContext} from "vue";

const nil = (args) => args;


/**
 * @description 定义一个api
 * @param method {string} 请求方法
 * @param api {string} 接口地址
 * @param store {Function?} 存储Store的获取方法
 * @param pk {string} 主键
 * @param data {Object} 请求参数
 * @param params {Object} 请求参数
 * @param ignoreReq {boolean} 有缓存时是否忽略请求
 * @param onCache {function} 有缓存时的回调
 * @param onError {function} 请求失败时的回调
 * @param onSuccess {function} 请求成功时的回调
 * @param type
 * @param headers
 * @returns {Promise<unknown>}
 */
export function defineApi({
                              method = 'get',
                              api,
                              store = null,
                              data = {},
                              params = {},
                              pk = 'id',
                              ignoreReq = false,
                              onCache = nil,
                              onError = nil,
                              onSuccess = nil,
                              type = 'data',
                              headers = undefined,
                          }) {
    return new Promise(async (resolve, reject) => {
        api = api.replace(/:(\w+)/g, (match, key) => {
            return params[key] ?? data[key] ?? match;
        });
        let id = data[pk] ?? data.id ?? data.pk ?? data;
        
        if (store) {
            store = store();
        }
        if (store) {
            let cacheData = await store.find(id);
            if (cacheData) {
                onCache(cacheData);
                if (ignoreReq) {
                    resolve(cacheData);
                    return;
                }
            }
        }
        resolve(request[method](api, {
            data: data,
            params: params,
            headers: headers,
        }).then(async res => {
            let responseData;
            if (type === 'data') {
                responseData = onSuccess(res?.data) ?? res?.data;
            } else {
                responseData = onSuccess(res) ?? res;
            }
            if (responseData) {
                if (store) {
                    await store.save(id, responseData);
                }
                return responseData;
            }
            return Promise.reject();
        }).catch(err => {
            return Promise.reject(onError(err) ?? err);
        }));
    });
}

export default function getHandleHeaders() {
    let headers = undefined;
    if (import.meta.env.SSR) {
        const ctx = useSSRContext();
        if (ctx.headers && ctx.headers.has('Accept-Language')) {
            headers = {
                'Accept-Language': ctx.headers.get('Accept-Language'),
            };
        }
    }
    return headers;
}
