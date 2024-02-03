<template>

</template>

<script setup>
import {loadNovels} from "@/api/novels.js";
import {useSettingStore} from "@/stores/settings.js";

const props = defineProps({
    type: {
        type: String,
        default: 'latest',
    },
    order: {
        type: String,
        default: 'desc',
        validator(value) {
            return ['desc', 'asc'].includes(value);
        },
    },
    listStyle: {
        type: String,
        default: 'style1',
    },
    desc: {
        type: Boolean,
        default: true,
    },
    author: {
        type: Boolean,
        default: true,
    },
    tags: {
        type: Array,
        default: null,
    },
    userId: {
        default: null,
    },
    keyword: {
        default: null,
    },
    ids: {
        default: null,
    },
    showLoadingComponent: {
        type: Boolean,
        default: false,
    },
    useSlot: {
        type: Boolean,
        default: false,
    },
    withChapters: {
        type: Boolean,
        default: false,
    },
    applyFilter: {
        type: Boolean,
        default: true,
    }
});

let setting = null;
// const hateTags = computed(() => settingStore.computedHateTags);
// const tags = computed(() => settingStore.computedTags.concat(props.tags || []));


onServerPrefetch(async () => {
    //settingStore = useSettingStore();
    let data = await loadNovels({
        page: data.page,
        order_by: props.type,
        order: props.order,
        user_id: props.userId,
        keyword: props.keyword,
        ids: props.ids,
        with_chapters: props.withChapters,
        tags: props.applyFilter ? data.tags : props.tags,
        hate_tags: props.applyFilter ? data.hateTags : null,
    });
    
});


</script>

<style scoped>

</style>
