import {defineStore} from 'pinia';

export default {
    useSettingStore: () => defineStore({
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
                return state.global.accaptedLanguages.filter((lang) => {
                    return !state.global.hideLanguaues.includes(lang.value);
                });
            },
            computedHateTags(state) {
                let tags = [];
                let showLanguages = state.global.accaptedLanguages.filter((lang) => {
                    return !state.global.hideLanguaues.includes(lang.value);
                });
                if (state.global.safeMode) {
                    tags.push('r-18');
                    tags.push('R18');
                }
                if (showLanguages.length > 1 || showLanguages.length === 0) {
                    if (state.global.hideLanguaues.length > 1) {
                        tags = tags.concat(state.global.hideLanguaues.map((lang) => {
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
                let showLanguages = state.global.accaptedLanguages.filter((lang) => {
                    return !state.global.hideLanguaues.includes(lang.value);
                });
                if (showLanguages.length === 1) {
                    tags.push(showLanguages[0].value);
                }
                return tags;
            },
        }
    }),
}
