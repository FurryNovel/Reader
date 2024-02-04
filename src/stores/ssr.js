import {defineStore} from 'pinia';
import {useCookieManager} from "@/utils/cookie.js";

export const useServerSideRenderStore = defineStore({
    id: 'server-side-render',
    persist: false,
    state: () => {
        return {};
    },
});
export default {
    useServerSideRenderStore,
};
