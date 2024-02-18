import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useBookmarkStore = defineStore(Object.assign(abstract, {
    id: 'bookmarks',
    lazy: false,
}));

export default {
    useBookmarkStore
};
