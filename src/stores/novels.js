import {defineStore} from 'pinia';
import {defineBaseStore} from "@/stores/abstract";

const abstract = defineBaseStore();
export default function useNovelStore() {
    return defineStore(Object.assign(abstract, {
        id: 'novels',
    }));
}
