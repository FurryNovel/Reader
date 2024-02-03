import {defineStore} from 'pinia';

export const useSettingStore = defineStore({
    id: 'settings',
    state: () => {
        return {
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
            }
        }
    },
    actions: {},
    getters: {
        showLanguages(state) {
            return state.global.acceptedLanguages.filter((lang) => {
                return !state.global.hideLanguages.includes(lang.value);
            });
        },
        computedHateTags(state) {
            let tags = [];
            let showLanguages = state.global.acceptedLanguages.filter((lang) => {
                return !state.global.hideLanguages.includes(lang.value);
            });
            if (state.global.safeMode) {
                tags.push('r-18');
                tags.push('R18');
            }
            if (showLanguages.length > 1 || showLanguages.length === 0) {
                if (state.global.hideLanguages.length > 1) {
                    tags = tags.concat(state.global.hideLanguages.map((lang) => {
                        return lang;
                    }));
                }
            }
            if (state.global.hideTags.length > 0) {
                tags = tags.concat(state.global.hideTags);
            }
            return tags;
        },
        computedTags(state) {
            let tags = [];
            let showLanguages = state.global.acceptedLanguages.filter((lang) => {
                return !state.global.hideLanguages.includes(lang.value);
            });
            if (showLanguages.length === 1) {
                tags.push(showLanguages[0].value);
            }
            return tags;
        },
    }
});
export default {
    useSettingStore,
};
