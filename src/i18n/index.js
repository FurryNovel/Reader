import ZH from './zh';
import EN from './en';

export const supportedLocales = {
    'zh': {
        name: '简体中文',
        translation: ZH,
    },
    'en': {
        name: 'English',
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
         * @returns {string}
         */
        t: key => {
            const locale = getLocale(router);
            return supportedLocales[locale]?.translation[key] ?? ZH[key] ?? key;
        },
        locale() {
            const route = useRoute();
            let locale = route?.params?.lang?.toString().toLowerCase();
            if (!locale || !supportedLocales.hasOwnProperty(locale)) {
                locale = getFallbackLocale();
            }
            return locale;
        },
    }
}
