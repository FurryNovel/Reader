import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useChapterStore = defineStore(Object.assign(abstract, {
    id: 'chapters',
    lazy: true,
}));

export default {
    useChapterStore
};
