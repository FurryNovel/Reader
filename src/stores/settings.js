import {defineStore} from 'pinia';
import {useCookieManager} from "@/utils/cookie.js";

export const useSettingStore = defineStore({
    id: 'settings',
    persist: true,
    state: () => {
        return {};
    },
});
export default {
    useSettingStore,
};
