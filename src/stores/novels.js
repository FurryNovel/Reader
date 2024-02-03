import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useNovelStore = defineStore(Object.assign(abstract, {
    id: 'novels',
    actions: {
        ...abstract.actions,
        isLazy() {
            return true;
        }
    }
}));

export default {
    useNovelStore
};
