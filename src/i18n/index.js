import ZH from './zh';
import EN from './en';
import {sprintf} from 'sprintf-js';

export const supportedLocales = {
    'zh': {
        id: 'zh',
        name: '简体中文',
        shortName: '中文',
        translation: ZH,
    },
    'en': {
        id: 'en',
        name: 'English',
        shortName: 'EN',
        translation: EN,
    },
}

export const getFallbackLocale = () => 'en';


export function getLocale(router) {
    let locale = router.currentRoute?.value?.params?.lang?.toString().toLowerCase();
    if (!locale || !supportedLocales.hasOwnProperty(locale)) {
        locale = getFallbackLocale();
    }
    return locale;
}


export function useI18n(router = null) {
    if (!router) {
        router = useRouter();
    }
    return {
        /**
         * @param key {string}
         * @param args
         * @returns {string}
         */
        t(key, ...args) {
            const locale = getLocale(router);
            return sprintf(supportedLocales[locale]?.translation[key] ?? ZH[key] ?? key, ...args);
        },
        locale() {
            return getLocale(router);
        },
    }
}
