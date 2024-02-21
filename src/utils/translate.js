import request from "@/utils/request";
import localForage from "localforage";
import {getReqId} from "@/utils/ssr.js";
import {useConfigProvider} from "@/provider/config.js";
import {asyncComputed} from "@vueuse/core";



export function detectedLanguage() {
    let lang = '中文';
    switch (navigator.language) {
        case 'zh-CN':
            lang = '中文';
            break;
        case 'zh-TW':
            lang = '中文';
            break;
        case 'en':
            lang = 'en';
            break;
        case 'ja':
            lang = 'ja';
        
    }
    return lang;
}

export function canTranslate(languages) {
    return !languages.includes(detectedLanguage());
}


export function translate({service, text, from, to = '', remote = false}) {
    if (!to){
        const config = useConfigProvider();
        if (config.global.translateTo === 'auto'){
            to = navigator.language;
        }else{
            to = config.global.translateTo;
        }
    }
    const cacheKey = getReqId({service, text, from, to}).toString();
    const instance = localForage.createInstance({
        name: 'translate',
        driver: localForage.INDEXEDDB,
    });
    switch (service) {
        case 'bing':
            if (!remote) {
                return instance.getItem(cacheKey).then(d => {
                    if (d) {
                        return d;
                    }
                    return translate({service, text, from, to, remote: true});
                });
            }
            return translateFromBing({text, from, to}).then(text => {
                instance.setItem(cacheKey, text);
                return text;
            });
        default:
            return Promise.reject('Unknown service');
    }
}


/**
 * @param toggleRef{{value: boolean}}
 * @param textRef{{value: string}}
 */
export function useTranslate(toggleRef, textRef) {
    return asyncComputed(async() => {
        if (!toggleRef.value || import.meta.env.SSR || !textRef.value) {
            return null;
        }
        return await translate({
            service: 'bing',
            text: textRef.value,
        }).catch(err => {
            dialog.alert({
                title: 'Error',
                content: err,
                cancelBtn: null,
            });
            return textRef.value;
        });
    }, null, {lazy: true})
}







/**
 * @return {string}
 * @type {{expires: number, token: string}}
 */
const bingToken = {
    token: '',
    expires: 0,
};


const bingErrors = {
    "The maximum request size has been exceeded.": {
        "zh-CN": "请求超过最大长度",
        "zh-TW": "請求超過最大長度",
    },
}

export function translateFromBing({text, from, to}) {
    return new Promise((resolve, reject) => {
        if (bingToken.token && bingToken.expires > Date.now()) {
            return resolve(bingToken.token);
        }
        request.get('https://edge.microsoft.com/translate/auth', {}).then(token => {
            if (token) {
                let jwt = token.split('.');
                let payload = JSON.parse(atob(jwt[1]));
                bingToken.token = token;
                bingToken.expires = payload.exp * 1000;
                resolve(token);
            } else {
                reject('Failed to get token');
            }
        }).catch(err => {
            reject(err);
        });
    }).then(token => {
        return request.post(
            'https://api-edge.cognitive.microsofttranslator.com/translate',
            JSON.stringify([{Text: text}]),
            {
                dataType: 'raw',
                headers: {
                    'accept': '*/*',
                    'authorization': 'Bearer ' + token,
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                },
                params: {
                    'from': from,
                    'to': to,
                    'api-version': '3.0',
                    'includeSentenceLength': 'true',
                },
            }
        ).then(res => {
            if (res?.[0]?.translations) {
                return res[0].translations[0].text.trim();
            }
            return Promise.reject(result);
        })
    }).catch(err => {
        if (err?.response?.data?.error?.message) {
            err.response.data.error.message = bingErrors[err.response.data.error.message][navigator.language];
        }
        return Promise.reject(err);
    });
}
