import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useNovelStore = defineStore(Object.assign(abstract, {
    id: 'novels',
    lazy: true,
}));

export default {
    useNovelStore
};
