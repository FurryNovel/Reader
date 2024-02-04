<template>
	<VirtualScroller :itemSize="50" :items="data.items" :pt="{ content: 'flex flex-row' }"
	                 class="border-1 surface-border border-round" orientation="horizontal"
	                 style="width: 200px; height: 200px">
		<template v-slot:item="{ item, options }">
			<div :class="['flex align-items-center p-2', { 'surface-hover': options.odd }]"
			     style="width: 50px; writing-mode: vertical-lr;">{{ item }}
			</div>
		</template>
	</VirtualScroller>
</template>

<script setup>
import {getReqId} from "@/api/api.js";
import {loadNovels} from "@/api/novels.js";
import {useConfigProvider} from "@/provider/config.js";
import {useServerSideRenderStore} from "@/stores/ssr.js";

const ssrStore = useServerSideRenderStore();
const configProvider = useConfigProvider();

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

const hateTags = computed(() => configProvider.hateTags);
const tags = computed(() => (configProvider?.tags || []).concat(props.tags || []));

const data = reactive({
    page: 1,
    items: [],
    loading: false,
    hasMore: true,
    reqId: '',
});

onServerPrefetch(async () => {
    data.page = 1;
    data.items = await loadData();
    ssrStore.$patch({
        [data.reqId]: data.items
    });
});

onBeforeMount(async () => {
	data.items = await loadData();
});

async function loadData() {
    const params = {
        page: data.page,
        order_by: props.type,
        order: props.order,
        user_id: props.userId,
        keyword: props.keyword,
        ids: props.ids,
        with_chapters: props.withChapters,
        tags: props.applyFilter ? tags.value : props.tags,
        hate_tags: props.applyFilter ? hateTags.value : null,
    };
    data.reqId = ('novel-list-' + await getReqId(params));
    if(!import.meta.env.SSR){
        console.log(ssrStore)
        return ssrStore[data.reqId] || loadNovels(params);
    }
    return loadNovels({params})
}

</script>

<style scoped>

</style>
