import request from "@/utils/request.js";

import {LRUCache} from 'lru-cache';
import {createCRC32} from "hash-wasm";

const nil = (args) => args;

export class CacheStore {
    constructor(store = null) {
    
    }
    
    async find(id) {
        throw new Error('Please initialize the store first');
    }
    
    save(id, data) {
        throw new Error('Please initialize the store first');
    }
}

export class LRUCacheStore extends CacheStore {
    constructor(store = null, params = {}) {
        super(store);
        if (this.store instanceof LRUCache) {
            throw new Error('store must be a LRUCache')
        } else {
            this.store = new LRUCache({
                max: 500,
                ttl: 1000 * 60 * 8,
                ...params,
            });
        }
    }
    
    async find(id) {
        let data = this.store.get(id);
        return data ? JSON.parse(data) : null;
    }
    
    save(id, data) {
        this.store.set(id, JSON.stringify(data));
    }
}

export class PiniaCacheStore extends CacheStore {
    constructor(store = null) {
        super(store);
        if (this.store === null) {
            throw new Error('store must be a Pinia store')
        }
    }
    
    async find(id) {
        return this.store.find(id);
    }
    
    save(id, data) {
        this.store.save(id, data);
    }
}

export const defaultCacheStore = new CacheStore();


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
                              onSuccess = nil
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
        }).then(res => {
            let responseData = onSuccess(res?.data) ?? res?.data;
            if (responseData) {
                if (store) {
                    store.save(id, responseData);
                }
                return responseData;
            }
            return Promise.reject();
        }).catch(err => {
            return Promise.reject(onError(err) ?? err);
        }));
    });
}

const crc32Instance = (await createCRC32());

export function getReqId(params = {}) {
    // noinspection JSCheckFunctionSignatures
    return crc32Instance.init().update(JSON.stringify(params)).digest('hex', null);
}

export function unWrapper(wrapper, ref, key = null) {
    const setRef = (value) => {
        if (!key){
            if (ref.value){
                ref.value = value;
            }
        }else{
            if(ref[key].value){
                ref[key].value = value;
            }else{
                ref[key] = value;
            }
        }
    }
    if (wrapper instanceof Promise) {
        return wrapper.then(data => {
            setRef(data);
        });
    } else {
        setRef(wrapper);
    }
    return Promise.resolve(wrapper);
}
