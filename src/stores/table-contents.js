import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();

export const useTableContentStore = defineStore(Object.assign(abstract, {
    id: 'table-contents',
    lazy: true,
}));

export default {
    useTableContentStore
};
