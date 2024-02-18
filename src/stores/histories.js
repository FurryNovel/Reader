import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useHistoryStore = defineStore(Object.assign(abstract, {
    id: 'history',
    lazy: true,
}));

export default {
    useHistoryStore
};
