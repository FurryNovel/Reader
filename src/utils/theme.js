import {useConfigProvider} from "@/provider/config.js";

const isDarkMode = ref(false);

export function initThemeManager() {
    if (import.meta.env.SSR) {
        return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        isDarkMode.value = e.matches;
    });
    if (mediaQuery.matches) {
        isDarkMode.value = true;
    }
}


export function onThemeChange(hook) {
    const config = useConfigProvider();
    watchEffect(() => {
        switch (config.global.themeMode) {
            case 'auto':
                if (isDarkMode.value) {
                    hook({
                        theme: 'dark',
                    });
                } else {
                    hook({
                        theme: 'light',
                    });
                }
                break;
            default:
                hook({
                    theme: config.global.themeMode,
                });
        }
    });
}

export function useTheme() {
    let theme = {};
    switch (config.global.themeMode) {
        case 'auto':
            if (isDarkMode.value) {
                theme = {
                    theme: 'dark',
                };
            } else {
                theme = {
                    theme: 'light',
                };
            }
            break;
        default:
            theme = {
                theme: config.global.themeMode,
            };
    }
    return theme;
}
