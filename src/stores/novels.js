import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();
export default {
    useNovelStore: () => defineStore(Object.assign(abstract, {
        id: 'novels',
    })),
}
