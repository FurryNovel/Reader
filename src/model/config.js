import {useSettingStore} from "@/stores/settings.js";
import {useCookieManager} from "@/utils/cookie.js";

export const baseConfig = {
    guildVersion: 0,
    chapter: {
        bgColor: 'rgba(232,232,232,1)',
        font: 'MiSans',
        fontColor: '#000000',
        fontSize: 20,
        padding: 40,
        autoPlay: false,
        viewType: 'book',
    },
    global: {
        themeMode: 'auto',
        safeMode: true,
        autoTranslate: false,
        translateTo: 'auto',
        acceptedLanguages: [
            {
                name: '中文',
                value: 'zh',
            },
            {
                name: '英语',
                value: 'en',
            },
            {
                name: '日語',
                value: 'ja',
            },
            {
                name: '韩语',
                value: 'ko',
            }
        ],
        hideLanguages: ['en', 'ja', 'ko'],
        hideTags: [],
    },
    //保存到cookie
    saveToCookie() {
        useCookieManager().set('settings', JSON.stringify(Object.fromEntries(Object.entries(this).filter(([key, value]) => {
            return !['showLanguages', 'hateTags', 'tags'].includes(key) && typeof value !== 'function' && value !== undefined;
        }))));
    },
    get showLanguages() {
        return this.global.acceptedLanguages.filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
    },
    get hateTags() {
        let tags = [];
        let showLanguages = this.global.acceptedLanguages.filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
        if (this.global.safeMode) {
            tags.push('r-18');
            tags.push('R18');
        }
        if (showLanguages.length > 1 || showLanguages.length === 0) {
            if (this.global.hideLanguages.length > 1) {
                tags = tags.concat(this.global.hideLanguages.map((lang) => {
                    return lang;
                }));
            }
        }
        if (this.global.hideTags.length > 0) {
            tags = tags.concat(this.global.hideTags);
        }
        return tags;
    },
    get tags() {
        let tags = [];
        let showLanguages = this.global.acceptedLanguages.filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
        if (showLanguages.length === 1) {
            tags.push(showLanguages[0].value);
        }
        return tags;
    },
}

export function useConfig() {
    const settingStore = useSettingStore();
    let base = baseConfig;
    base = Object.fromEntries(Object.entries(base).filter(([key, value]) => {
        return !['showLanguages', 'hateTags', 'tags'].includes(key);
    }));
    let state = Object.assign(base, settingStore.$state);
    // noinspection JSUnresolvedReference
    state.chapter = Object.assign(base.chapter, state.chapter);
    // noinspection JSUnresolvedReference
    state.global = Object.assign(base.global, state.global);
    watchEffect(() => {
        state.saveToCookie();
        settingStore.$patch(state);
    });
    return state;
}
