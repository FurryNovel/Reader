import {useSettingStore} from "@/stores/settings.js";
import {useCookieManager} from "@/utils/cookie.js";
import {useSSRContext} from "vue";

export const baseConfig = {
    guildVersion: 0,
    chapter: {
        bgColor: '#E8E8E8',
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
            return typeof value !== 'function' && value !== undefined;
        }))));
    },
    getShowLanguages() {
        return this.global.acceptedLanguages.filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
    },
    getHateTags() {
        let tags = [];
        let showLanguages = this.global.acceptedLanguages.filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
        if (this.global.safeMode) {
            tags.push('r-18');
            tags.push('R18');
        }
        if (showLanguages.length > 1 || showLanguages.length === 0) {
            if (this.global.hideLanguages.length > 0) {
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
    getTags() {
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

export function useConfigProvider() {
    let base = baseConfig;
    base = Object.fromEntries(Object.entries(base));
    let state = null;
    if (!import.meta.env.SSR) {
        const settingStore = useSettingStore();
        state = Object.assign(base, settingStore.$state);
    } else {
        const ctx = useSSRContext();
        state = JSON.parse(ctx.cookies?.settings ?? '{}');
        state = Object.assign(base, state,);
    }
    // noinspection JSUnresolvedReference
    state.chapter = Object.assign(base.chapter, state.chapter);
    // noinspection JSUnresolvedReference
    state.global = Object.assign(base.global, state.global);
    
    const wrapper = reactive(state);
    if (!import.meta.env.SSR) {
        const settingStore = useSettingStore();
        watch(wrapper, () => {
            state.saveToCookie();
            settingStore.$patch(state);
        }, {deep: true});
    }
    return wrapper;
}
