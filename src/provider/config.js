import {useSettingStore} from "@/stores/settings.js";
import {useCookieManager} from "@/utils/cookie.js";
import {useSSRContext} from "vue";
import {merge} from 'lodash-es';
import {useI18n} from "@/i18n/index.js";

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
        pwaInstaller: true,
        themeMode: 'auto',
        safeMode: true,
        autoTranslate: false,
        translateTo: 'auto',
        hideLanguages: [],
        hideTags: [],
    },
    filter: {
        strictMode: false,
    },
    getAcceptedLanguages() {
        return [
            {
                name: '中文',
                value: 'zh',
            },
            {
                name: '英语',
                value: 'en',
            },
            {
                name: '日语',
                value: 'ja',
            },
            {
                name: '韩语',
                value: 'ko',
            }
        ];
    },
    //保存到cookie
    saveToCookie() {
        useCookieManager().set('settings', JSON.stringify(Object.fromEntries(Object.entries(this).filter(([key, value]) => {
            return typeof value !== 'function' && value !== undefined;
        }))));
    },
    getShowLanguages() {
        return this.getAcceptedLanguages().filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
    },
    getHateTags() {
        let tags = [];
        let showLanguages = this.getAcceptedLanguages().filter((lang) => {
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
        let showLanguages = this.getAcceptedLanguages().filter((lang) => {
            return !this.global.hideLanguages.includes(lang.value);
        });
        if (showLanguages.length === 1) {
            tags.push(showLanguages[0].value);
        }
        return tags;
    },
    checkTagsHideStatus(targetTags, i18nFn = null) {
        if (i18nFn) {
            const t = i18nFn;
        } else {
            const {t} = useI18n();
        }
        const rules = [
            {
                tags: this.global.hideLanguages.map(lang => t(lang)),
                reason: 'language',
            },
            {
                tags: this.global.hideTags,
                reason: 'user',
            }
        ];
        if (this.global.safeMode) {
            rules.push({
                tags: [
                    'R18', 'r-18',
                    'NSFW', 'nsfw',
                ],
                reason: 'r18',
            });
        }
        for (const rule of rules) {
            for (const tag of targetTags) {
                if (rule.tags.includes(tag)) {
                    return rule.reason;
                }
            }
        }
        return true;
    }
}
export let globalConfig = reactive({
    ...baseConfig,
});

if (!import.meta.env.SSR) {
    watch(globalConfig, () => {
        const settingStore = useSettingStore();
        globalConfig.saveToCookie();
        settingStore.$patch(globalConfig);
    }, {deep: true});
}

export function useConfigProvider() {
    let state = null;
    if (!import.meta.env.SSR) {
        const settingStore = useSettingStore();
        state = settingStore.$state;
    } else {
        const ctx = useSSRContext();
        state = JSON.parse(ctx.cookies?.settings ?? '{}');
    }
    const targetObject = merge({}, baseConfig, state);
    
    let hideLanguages = null
    if (state?.global?.hideLanguages) {
        hideLanguages = state.global.hideLanguages;
    } else {
        // switch (locale) {
        //     case 'zh':
        //         hideLanguages = ['en', 'ja', 'ko'];
        //         break;
        //     case 'en':
        //         hideLanguages = ['zh', 'ja', 'ko'];
        //         break;
        //     case 'ja':
        //         hideLanguages = ['zh', 'en', 'ko'];
        //         break;
        //     case 'ko':
        //         hideLanguages = ['zh', 'en', 'ja'];
        //         break;
        // }
        hideLanguages = [];
    }
    targetObject.global.hideLanguages = hideLanguages || baseConfig.global.hideLanguages;
    Object.keys(targetObject).forEach((key) => {
        if (targetObject[key] !== undefined) {
            globalConfig[key] = targetObject[key];
        }
    });
    return globalConfig;
}
