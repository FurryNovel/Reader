import {useSSRContext} from "vue";

let headers = {
    'User-Agent': null,
};

export function initThirdEvent() {
    if (import.meta.env.SSR) {
        const ctx = useSSRContext();
        if (ctx.headers && ctx.headers.has('User-Agent')) {
            headers = {
                'User-Agent': ctx.headers.get('User-Agent'),
            };
        }
    } else {
        headers = {
            'User-Agent': window.navigator.userAgent,
        };
    }
}


export function isThirdReader() {
    if (!headers['User-Agent']) {
        return false;
    }
    return /Reader/i.test(headers['User-Agent']);
}
