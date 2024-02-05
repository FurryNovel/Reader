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
        },
        save(id, data) {
            this.$state[id] = data;
            this.$patch(this.$state);
        },
    },
});
export default {
    useServerSideRenderStore,
};
