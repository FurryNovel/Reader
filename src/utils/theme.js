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
    const config = useConfigProvider();
    return computed(() => {
        let theme = null;
        switch (config.global.themeMode) {
            case 'auto':
                if (isDarkMode.value) {
                    theme = 'dark';
                } else {
                    theme = 'light'
                }
                break;
            default:
                theme = config.global.themeMode;
        }
        return theme;
    });
}

export function toggleTheme() {
    const theme = useTheme();
    const config = useConfigProvider();
    config.global.themeMode = theme.value === 'dark' ? 'light' : 'dark';
}
