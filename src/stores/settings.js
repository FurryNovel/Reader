import {defineStore} from 'pinia';
import {useCookieManager} from "@/utils/cookie.js";

export const useSettingStore = defineStore({
    id: 'settings',
    state: () => {
        return {};
    },
});
export default {
    useSettingStore,
};
