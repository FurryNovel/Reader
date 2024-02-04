import {defineStore} from 'pinia';
import {useCookieManager} from "@/utils/cookie.js";

export const useServerSideRenderStore = defineStore({
    id: 'server-side-render',
    persist: false,
    state: () => {
        return {};
    },
    actions: {
        find(id) {
            return this.$state[id] ?? null;
        }
    },
});
export default {
    useServerSideRenderStore,
};
