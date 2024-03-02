import {LRUCache} from "lru-cache";
import {useSSRContext} from "vue";
import {useCloudflareEnv} from "@/utils/cloudflare-env.js";

export class CacheStore {
    store = null;
    
    constructor(store = null) {
        this.store = store;
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
        return true;
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
        return true;
    }
}

export class SmartCacheStore extends CacheStore {
    params = {
        ttl: 1000 * 60 * 8,
    };
    
    
    /**
     * @param store { ?string }
     * @param params
     */
    constructor(store = null, params = {}) {
        if (!store) {
            store = 'store-';
        }
        super(store);
        this.params = {
            ...this.params,
            ...params,
        };
    }
    
    getEnv() {
        const env = import.meta.env.SSR ? useCloudflareEnv() : null;
        if (!env.value) {
            if (typeof this.store === 'string') {
                this.store = new LRUCache({
                    max: 500,
                    ...this.params,
                });
            }
        }
        return env;
    }
    
    async find(id) {
        const key = `https://invaild.hostname/${this.store}/${id}`;
        let data = null;
        const env = this.getEnv();
        try {
            if (env.value) {
                const response = await env.value.cache.match(key);
                if (response) {
                    data = await (await response.blob()).text();
                }
            } else {
                data = this.store.get(id);
            }
            if (data && data !== 'undefined') {
                data = JSON.parse(data);
            }
        } catch (e) {
            console.log(e.stack)
        }
        return data || null;
    }
    
    async save(id, data) {
        const key = `https://invaild.hostname/${this.store}/${id}`;
        const env = this.getEnv();
        if (env.value) {
            const response = new Response(JSON.stringify(data));
            response.headers.append('Cache-Control', `s-maxage=${this.params.ttl / 1000}`);
            env.value.cache.put(key, response);
        } else {
            this.store.set(id, JSON.stringify(data));
        }
        return true;
    }
}
