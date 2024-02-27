// noinspection JSUnresolvedReference

import axios from 'axios';
import config from "@/config.js";
import fetchAdapter from "@haverstack/axios-fetch-adapter";

const toJson = (data) => {
    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            /* Ignore */
        }
    }
    return data;
}

const service = axios.create({
    baseURL: ((import.meta.env.SSR || location.host !== config.host) ? config.base : '') + `/api`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    adapter: (fetchAdapter?.default) ? fetchAdapter.default : fetchAdapter,
    retryCount: 1,
});

service.interceptors.response.use(res => {
    const data = res.data || {code: res.status, msg: '未知错误', data: {}}
    const code = data.code || res.status;
    const msg = data.msg ?? '未知错误';
    if (code === 401 || code === 403 || code === 503) {
        return dialog.challenge().then(() => {
            //重播
            if (!res.config.hasOwnProperty('retryCount')) {
                res.config.retryCount = 1;
            }
            if (res.config.retryCount > 0) {
                res.config.retryCount--;
                return service.request(res.config)
            }
            return dialog.alert({
                title: '提示',
                content: '请先完成人机验证。',
            });
        })
    } else if (code === 500) {
        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        dialog.toast({
            title: '提示',
            content: msg,
        });
        return Promise.reject('error')
    } else {
        return res.data
    }
});


export default service;
