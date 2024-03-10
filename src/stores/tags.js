import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useTagStore = defineStore(Object.assign(abstract, {
    id: 'tags',
    lazy: true,
}));

export default {
    useTagStore
};
