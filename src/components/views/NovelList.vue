<template>
	<template v-if="props.listStyle === 'style1'">
		<div class="h-full w-full flex-col border-1 surface-border border-round">
			<div class="mb-4 flex flex-row flex-wrap items-center">
				<template v-for="item in data.items">
					<div class="m-2 flex h-auto select-none flex-col rounded-xl bg-gray-50 transition duration-300 w-[128px] group align-items-center hover:-translate-y-2 hover:scale-110 hover:shadow-2xl">
						<div class="relative flex w-32 flex-1 flex-col items-center justify-between overflow-hidden rounded-xl max-h-[178px] min-h-[178px] aspect-[10/16]">
							<img :alt="`${item.name}(cover)`" :src="item.cover" :draggable="false"
							     class="absolute h-full w-full object-cover aspect-[140/186]"/>
						</div>
						<div class="flex flex-col items-center justify-center m-2 transition duration-300 text-xs font-bold !line-clamp-1 h-[16px] leading-[16px]">
							{{ item.name }}
						</div>
						<div class="flex flex-col m-2 transition duration-300 text-xs !line-clamp-1 h-[16px]">
							{{ item.author.nickname }}
						</div>
					</div>
				</template>
			</div>
		</div>
	</template>
</template>

<script setup>
import {getReqId, unWrapper} from "@/api/api.js";
import {loadNovels} from "@/api/novels.js";
import {useConfigProvider} from "@/provider/config.js";
import {useServerSideRenderStore} from "@/stores/ssr.js";
import {useDeviceInfo} from "@/utils/device.js";

const vm = getCurrentInstance();

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
    },
    limit: {
        default: null,
    }
});
const data = reactive({
    page: 1,
    items: [],
    loading: false,
    hasMore: true,
    reqId: '',
});

const isMounted = ref(false);

const hateTags = computed(() => configProvider.hateTags);
const tags = computed(() => (configProvider?.tags || []).concat(props.tags || []));


onServerPrefetch(() => new Promise((resolve) => {
    data.page = 1;
    loadData().then((items) => {
        // noinspection JSValidateTypes
        data.items = props.limit ? items.slice(0, props.limit) : items;
        ssrStore.save(vm.id, data.items);
    }).finally(() => {
        resolve();
    });
}));

onBeforeMount(() => {
    unWrapper(loadData(), data, 'items').then(() => {
        data.items = props.limit ? data.items.slice(0, props.limit) : items;
    });
});

onMounted(() => {
    isMounted.value = true;
});

function loadData() {
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
    data.reqId = vm.id;
    if (!import.meta.env.SSR) {
        const prefetch = ssrStore.find(data.reqId);
        if (prefetch) {
            return prefetch;
        }
    }
    return loadNovels({params, ignoreReq: import.meta.env.SSR})
}

</script>

<style scoped>
</style>
